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
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonSpinner
} from '@ionic/react';
import { heart, heartOutline, chevronDownCircleOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  is_favorite?: boolean;
}

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    setError(null);
    
    if (text.length < 1) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    try {
      // First, get the posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          post_id,
          user_id,
          username,
          avatar_url,
          post_content,
          post_created_at
        `)
        .ilike('post_content', `%${text}%`)
        .order('post_created_at', { ascending: false });

      if (postsError) throw postsError;

      if (!postsData) {
        setPosts([]);
        return;
      }

      // If user is logged in, get their favorites
      if (user) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('post_id')
          .eq('user_id', user.id);

        if (favoritesError) throw favoritesError;

        const favoritePostIds = new Set(favoritesData?.map(f => f.post_id) || []);
        const postsWithFavorites = postsData.map(post => ({
          ...post,
          is_favorite: favoritePostIds.has(post.post_id)
        }));

        setPosts(postsWithFavorites);
      } else {
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
      setError('Failed to search posts. Please try again.');
      setToastMessage('Error searching posts');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (post: Post) => {
    if (!user) {
      setToastMessage('Please login to favorite posts');
      setShowToast(true);
      return;
    }

    try {
      if (post.is_favorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ 
            post_id: post.post_id,
            user_id: user.id 
          });

        if (error) throw error;
        setToastMessage('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            post_id: post.post_id,
            user_id: user.id
          });

        if (error) throw error;
        setToastMessage('Added to favorites');
      }

      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.post_id === post.post_id 
            ? { ...p, is_favorite: !p.is_favorite }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setToastMessage('Error updating favorites');
      setShowToast(true);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    if (searchText) {
      await handleSearch(searchText);
    }
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Posts</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>

        <div style={{ 
          padding: '16px', 
          backgroundColor: 'var(--ion-color-light)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <IonSearchbar
            value={searchText}
            onIonChange={e => handleSearch(e.detail.value || '')}
            placeholder="Search posts..."
            debounce={300}
            className="custom-searchbar"
          />
        </div>

        <div className="ion-padding">
          {error ? (
            <div className="ion-padding ion-text-center">
              <IonText color="danger">
                <h2>Error</h2>
                <p>{error}</p>
              </IonText>
              <IonButton onClick={() => handleSearch(searchText)}>
                Try Again
              </IonButton>
            </div>
          ) : isLoading ? (
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
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://ionicframework.com/docs/img/demos/avatar.svg';
                            }}
                          />
                        </IonAvatar>
                      </IonCol>
                      <IonCol>
                        <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                        <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                      </IonCol>
                      <IonCol size="auto">
                        <IonButton 
                          fill="clear" 
                          onClick={() => toggleFavorite(post)}
                        >
                          <IonIcon 
                            slot="icon-only" 
                            icon={post.is_favorite ? heart : heartOutline} 
                            color={post.is_favorite ? "danger" : "medium"} 
                          />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText>
                      <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
                        {post.post_content}
                      </p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : searchText.length > 0 ? (
            <div className="ion-padding ion-text-center">
              <IonText color="medium">
                <h2>No posts found</h2>
                <p>Try different search terms</p>
              </IonText>
            </div>
          ) : (
            <div className="ion-padding ion-text-center">
              <IonText color="medium">
                <h2>Search Posts</h2>
                <p>Type to search for posts</p>
              </IonText>
            </div>
          )}
        </div>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
      />
    </IonPage>
  );
};

export default Search; 