import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonAvatar,
  IonRow,
  IonCol,
  IonText,
  IonSkeletonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonPopover
} from '@ionic/react';
import { pencil } from 'ionicons/icons';
import { supabase } from '../../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
}

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUser(authData.user);
      }
    };
    fetchUser();
  }, []);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length < 1) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .ilike('post_content', `%${text}%`)
        .order('post_created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Posts</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <IonSearchbar
            value={searchText}
            onIonChange={e => handleSearch(e.detail.value || '')}
            placeholder="Search posts..."
            debounce={300}
            style={{
              '--background': '#ffffff',
              '--border-radius': '8px',
              '--box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
              '--color': '#000000',
              '--placeholder-color': '#666666'
            }}
          />
        </div>

        <div className="ion-padding">
          {isLoading ? (
            <div className="ion-padding">
              {[1, 2, 3].map((_, index) => (
                <IonCard key={index}>
                  <IonCardHeader>
                    <IonRow>
                      <IonCol size="2">
                        <IonSkeletonText animated style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      </IonCol>
                      <IonCol>
                        <IonSkeletonText animated style={{ width: '60%' }} />
                        <IonSkeletonText animated style={{ width: '40%' }} />
                      </IonCol>
                    </IonRow>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: '100%' }} />
                    <IonSkeletonText animated style={{ width: '80%' }} />
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="ion-padding">
              {posts.map(post => (
                <IonCard key={post.post_id} style={{ marginTop: '1rem' }}>
                  <IonCardHeader>
                    <IonRow>
                      <IonCol size="1.85">
                        <IonAvatar>
                          <img 
                            src={post.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                            alt={post.username}
                          />
                        </IonAvatar>
                      </IonCol>
                      <IonCol>
                        <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                        <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                      </IonCol>
                    </IonRow>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText style={{ color: 'black' }}>
                      <h1>{post.post_content}</h1>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : searchText.length > 0 ? (
            <div className="ion-padding ion-text-center">
              <IonText color="medium">
                No posts found matching "{searchText}"
              </IonText>
            </div>
          ) : (
            <div className="ion-padding ion-text-center">
              <IonText color="medium">
                Type to search for posts
              </IonText>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;