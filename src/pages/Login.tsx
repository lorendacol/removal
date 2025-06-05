import { 
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent, 
  IonIcon, 
  IonInput, 
  IonInputPasswordToggle,  
  IonPage,  
  IonToast, 
  useIonRouter 
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    console.log('User logged in successfully:', email); // ✅ Log success to the console
    setShowToast(true); 

    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <div style={{
          display: 'flex',
          flexDirection:'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',  // Full height of the screen
          background: '#2C2F36', // Darker background color (neutral)
        }}>
          <IonAvatar
            style={{
              marginBottom: '20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#007BFF', // Blue background for the avatar
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <IonIcon 
              icon={logoIonic}
              color='light'
              style={{ fontSize: '40px' }} 
            />
          </IonAvatar>

          <h1 style={{
            fontSize: '24px',
            color: '#FFF',  // White text for the title to stand out against the dark background
            fontWeight: '600',
            marginBottom: '20px',
          }}>
            User Login
          </h1>

          {/* Email Input */}
          <IonInput
            label="Email" 
            labelPlacement="floating" 
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            style={{
              width: '300px',  // Longer input container
              marginBottom: '15px',
              borderRadius: '50px',  // Rounded shape for a pill-like effect
              fontSize: '16px',
              padding: '12px',  // More padding for better input visibility
              backgroundColor: '#4F5B66', // Subtle neutral background for input
              color: '#FFF', // White text inside input for readability
             
            }}
          />

          {/* Password Input */}
          <IonInput      
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            style={{
              width: '300px',  // Same width as email input
              marginBottom: '20px',
              borderRadius: '50px',  // Rounded shape for a pill-like effect
              fontSize: '16px',
              padding: '12px',  // More padding for comfort
              backgroundColor: '#4F5B66', // Neutral background for input
              color: '#FFF', // White text inside input
              border: '1px solid #6C757D', // Soft border to define input box
            }}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>
<IonButton 
  onClick={doLogin} 
  expand="full" 
  shape="round" 
  style={{
    backgroundColor: '#333',  // Dark background for professionalism
    color: '#fff',  // White text for contrast
    padding: '12px 0',
    borderRadius: '25px',  // Rounded corners
    fontSize: '18px',
    border: 'none',  // Removes the default border/outline
  }}
>
  Login
</IonButton>

          {/* Register Button */}
          <IonButton 
            routerLink="/it35-lab/register" 
            expand="full" 
            fill="clear" 
            shape='round' 
            style={{
              marginTop: '12px',
              fontSize: '14px',
              color: '#007BFF',  // Blue color for consistency with login button
            }}
          >
            Don't have an account? Register here
          </IonButton>

          {/* Reusable AlertBox Component */}
          <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

          {/* IonToast for success message */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Login successful! Redirecting..."
            duration={1500}
            position="top"
            color="primary"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
