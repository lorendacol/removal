import { 
    IonAlert,
    IonButton,
    IonButtons,
      IonContent, 
      IonHeader, 
      IonIcon, 
      IonItem, 
      IonMenu, 
      IonMenuButton, 
      IonMenuToggle, 
      IonPage, 
      IonRouterOutlet, 
      IonSplitPane, 
      IonTitle, 
      IonToast, 
      IonToolbar, 
      useIonRouter
  } from '@ionic/react'
  import {homeOutline, logOutOutline, rocketOutline, settingsOutline} from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import Home from './Home';
import About from './About';
import Details from './Details';
import EditProfile from './EditProfile';
import { supabase } from '../utils/supabaseClient';
import { useEffect, useState } from 'react';

const Menu: React.FC = () => {
    const navigation = useIonRouter();
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    const path = [
        {name:'Home', url: '/removal/app/home', icon: homeOutline},
        {name:'About', url: '/removal/app/about', icon: rocketOutline},
        {name:'Profile', url: '/removal/app/profile', icon: settingsOutline},
    ]

    useEffect(() => {
        const getUserEmail = async () => {
          const { data: sessionData, error } = await supabase.auth.getSession();
          if (error || !sessionData?.session?.user?.email) {
            console.log('No logged in user or error:', error?.message);
            return;
          }
      
          console.log('Logged in user email:', sessionData.session.user.email);
        };
      
        getUserEmail();
    }, []);
      
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setShowToast(true);
            setTimeout(() => {
                navigation.push('/removal', 'back', 'replace'); 
            }, 300); 
        } else {
            setErrorMessage(error.message);
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <IonSplitPane contentId="main">
                <IonMenu contentId="main">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>
                                Menu
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {path.map((item,index) =>(
                            <IonMenuToggle key={index}>
                                <IonItem routerLink={item.url} routerDirection="forward">
                                    <IonIcon icon={item.icon} slot="start"></IonIcon>
                                    {item.name}
                                </IonItem>
                            </IonMenuToggle>
                        ))}

                       <IonButton expand="full" onClick={handleLogout}>
                            <IonIcon icon={logOutOutline} slot="start"></IonIcon>
                            Logout
                        </IonButton>
                        
                    </IonContent>
                </IonMenu>
                
                <IonRouterOutlet id="main">
                    <Route path="/removal/app/home" component={Home} />
                    <Route exact path="/removal/app/about" component={About} />
                    <Route exact path="/removal/app/profile" component={EditProfile} />
                    <Route exact path="/removal/app/home/details" component={Details} />

                    <Route exact path="/removal/app">
                        <Redirect to="/removal/app/home"/>
                    </Route>
                </IonRouterOutlet>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Logout Failed"
                    message={errorMessage}
                    buttons={['OK']}
                />
                
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Logout Successful"
                    duration={1500}
                    position="top"
                    color="primary"
                />

            </IonSplitPane>
        </IonPage>
    );
};
  
export default Menu;
