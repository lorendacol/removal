import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonModal, 
  IonText, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent, 
  IonImg,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonAvatar,
  IonItemDivider
} from '@ionic/react';
import { useState } from 'react';
import { informationCircleOutline, codeSlashOutline, timeOutline, mailOutline, logoGithub, logoTwitter, logoLinkedin } from 'ionicons/icons';

const About: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {/* Hero Section */}
        <div className="ion-text-center ion-padding">
          <h1 className="ion-padding-bottom">About This App</h1>
          <p className="ion-padding-horizontal">
            A professional mobile application developed with Ionic React, showcasing modern development principles and best practices.
          </p>
        </div>

        <IonGrid>
          <IonRow>
            {/* App Information Card */}
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={informationCircleOutline} className="ion-margin-end" />
                    App Overview
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    This mobile application was developed as part of our <strong>Application Development (AppDev)</strong> course project. 
                    It showcases the core concepts of modern mobile app creation using <strong>Ionic React</strong>, 
                    including responsive design, state management, and component-based architecture.
                  </p>

                  <p>
                    The app is structured to provide users with an intuitive and seamless experience, demonstrating a well-rounded 
                    implementation of mobile development principles.
                  </p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Technologies Card */}
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={codeSlashOutline} className="ion-margin-end" />
                    Technologies Used
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    This app was built using <strong>Ionic React</strong> and leverages various modern web technologies.
                  </p>
                  
                  <div className="ion-padding-top">
                    <IonChip color="primary">Ionic</IonChip>
                    <IonChip color="primary">React</IonChip>
                    <IonChip color="primary">TypeScript</IonChip>
                    <IonChip color="primary">CSS</IonChip>
                    <IonChip color="primary">HTML</IonChip>
                    <IonChip color="primary">JavaScript</IonChip>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Features Section */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Key Features</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem lines="none">
                          <IonLabel>
                            <h3>Responsive Design</h3>
                            <p>Clean, responsive, and mobile-first UI</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem lines="none">
                          <IonLabel>
                            <h3>Navigation</h3>
                            <p>Intuitive navigation using Ionic Router</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem lines="none">
                          <IonLabel>
                            <h3>Component Architecture</h3>
                            <p>Reusable and modular components</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem lines="none">
                          <IonLabel>
                            <h3>State Management</h3>
                            <p>Efficient stateful data handling</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Timeline Section */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={timeOutline} className="ion-margin-end" />
                    Development Timeline
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel>
                        <h2>Phase 1</h2>
                        <p>Initial Setup & Project Planning</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h2>Phase 2</h2>
                        <p>Basic Structure & Navigation</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h2>Phase 3</h2>
                        <p>State Management and Components</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h2>Phase 4</h2>
                        <p>UI Optimization & Responsiveness</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>
                        <h2>Phase 5</h2>
                        <p>Final Touches and Testing</p>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Learn More Button - Centered and with margin */}
        <div className="ion-text-center ion-padding">
          <IonButton 
            size="large" 
            color="primary" 
            onClick={() => setShowModal(true)}
          >
            Learn More
          </IonButton>
        </div>

        {/* Modal with more information */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Additional Information</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Why This App Was Built</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  This app was developed to teach students about the <strong>Ionic framework</strong>, which allows developers to create mobile apps using 
                  web technologies like HTML, CSS, and JavaScript. With the app's modular architecture, students can practice building 
                  reusable components and handling stateful data. The app also provides an opportunity to experiment with mobile navigation,
                  design patterns, and performance optimization techniques.
                </p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Future Enhancements</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  In the future, this app may include additional features like user authentication, an API connection to fetch data,
                  and more complex state management using tools like Redux or Context API. The design and functionality will evolve 
                  as we continue learning and implementing more advanced concepts in mobile development.
                </p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Meet the Developer</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="ion-text-center ion-padding">
                  <IonAvatar style={{width: '80px', height: '80px', margin: '0 auto'}}>
                    <img src="/api/placeholder/80/80" alt="Developer" />
                  </IonAvatar>
                  <h2 className="ion-padding-top">App Developer</h2>
                </div>
                <p className="ion-padding-top">
                  This app is an individual project developed by a student in the Application Development course. 
                  It was designed and built covering all aspects from front-end development to UI/UX design, and mobile application development.
                </p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={mailOutline} className="ion-margin-end" />
                  Contact Information
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  Feel free to reach out for any inquiries or feedback.
                </p>
                <IonItem href="mailto:dacolloren@gmail.com" detail={true} lines="none" className="ion-margin-top">
                  <IonLabel>
                    <h2>Email</h2>
                    <p>dacolloren@gmail.com</p>
                  </IonLabel>
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Social Media</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem href="https://github.com/lorendacol" target="_blank" rel="noopener noreferrer" detail={true}>
                    <IonIcon icon={logoGithub} slot="start" />
                    <IonLabel>GitHub</IonLabel>
                  </IonItem>
                  <IonItem href="https://twitter.com/appdev" target="_blank" rel="noopener noreferrer" detail={true}>
                    <IonIcon icon={logoTwitter} slot="start" />
                    <IonLabel>Twitter</IonLabel>
                  </IonItem>
                  <IonItem href="https://www.linkedin.com/company/appdev" target="_blank" rel="noopener noreferrer" detail={true} lines="none">
                    <IonIcon icon={logoLinkedin} slot="start" />
                    <IonLabel>LinkedIn</IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default About;