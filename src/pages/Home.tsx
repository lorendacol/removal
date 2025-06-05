import { 
  IonButton,
    IonButtons,
      IonContent, 
      IonHeader, 
      IonIcon, 
      IonLabel, 
      IonMenuButton, 
      IonPage, 
      IonRouterOutlet, 
      IonTabBar, 
      IonTabButton, 
      IonTabs,
      IonTitle,

      IonToolbar 

} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { bookOutline, search, star } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import Favorites from './home-tabs/Favorites';
import Feed from './home-tabs/Feed';
import Search from './home-tabs/Search';

const Home: React.FC = () => {
  const tabs = [
    {name: 'Feed', tab: 'feed', url: '/removal/app/home/feed', icon: bookOutline},
    {name: 'Search', tab: 'search', url: '/removal/app/home/search', icon: search},
    {name: 'Favorites', tab: 'favorites', url: '/removal/app/home/favorites', icon: star},
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/removal/app/home/feed">
              <Feed />
            </Route>
            <Route exact path="/removal/app/home/search">
              <Search />
            </Route>
            <Route exact path="/removal/app/home/favorites">
              <Favorites />
            </Route>
            <Route exact path="/removal/app/home">
              <Redirect to="/removal/app/home/feed" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            {tabs.map((item, index) => (
              <IonTabButton key={index} tab={item.tab} href={item.url}>
                <IonIcon icon={item.icon} />
                <IonLabel>{item.name}</IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </IonPage>
  );
};

export default Home;