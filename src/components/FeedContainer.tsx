import { useState, useEffect } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover, IonToast } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { colorFill, pencil, trash, heart, heartOutline } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

interface Favorite {
  id: number;
  user_id: string;
  post_id: string;
  created_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });
  const [favoritePostIds, setFavoritePostIds] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
          await fetchFavorites(authData.user.id);
        }
      }
    };
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };
    fetchUser();
    fetchPosts();
  }, []);

  const fetchFavorites = async (userId: string) => {
    try {
      console.log('Fetching favorites for user:', userId);
      const { data, error } = await supabase
        .from('favorites')
        .select('post_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favorites:', error);
        setToastMessage(`Error loading favorites: ${error.message}`);
        setShowToast(true);
        return;
      }

      if (!data) {
        console.log('No favorites data returned');
        setFavoritePostIds([]);
        return;
      }

      console.log('Fetched favorites:', data);
      setFavoritePostIds(data.map(fav => fav.post_id));
    } catch (error) {
      console.error('Unexpected error fetching favorites:', error);
      setToastMessage(`Unexpected error loading favorites: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowToast(true);
    }
  };

  const toggleFavorite = async (postId: string) => {
    if (!user) {
      setToastMessage('Please log in to add favorites');
      setShowToast(true);
      return;
    }

    try {
      console.log('Checking favorite for post:', postId, 'user:', user.id);
      // First, check if the favorite already exists
      const { data: existingFavorite, error: checkError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking favorite:', checkError);
        setToastMessage(`Error checking favorite status: ${checkError.message}`);
        setShowToast(true);
        return;
      }

      console.log('Existing favorite:', existingFavorite);

      if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, post_id: postId });

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          setToastMessage(`Error removing from favorites: ${deleteError.message}`);
          setShowToast(true);
          return;
        }

        console.log('Successfully removed favorite');
        setFavoritePostIds(prev => prev.filter(id => id !== postId));
        setToastMessage('Post removed from favorites');
      } else {
        // Add to favorites
        console.log('Adding new favorite');
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            post_id: postId,
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error adding favorite:', insertError);
          if (insertError.code === '23503') {
            setToastMessage('Error: Post no longer exists');
          } else if (insertError.code === '23505') {
            setToastMessage('Post is already in favorites');
          } else {
            setToastMessage(`Error adding to favorites: ${insertError.message}`);
          }
          setShowToast(true);
          return;
        }

        console.log('Successfully added favorite');
        setFavoritePostIds(prev => [...prev, postId]);
        setToastMessage('Post added to favorites');
      }

      setShowToast(true);
    } catch (error) {
      console.error('Unexpected error updating favorites:', error);
      setToastMessage(`Error updating favorites: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowToast(true);
    }
  };

  const createPost = async () => {
    if (!postContent || !user || !username) return;
  
    // Fetch avatar URL
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();
  
    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }
  
    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
  
    // Insert post with avatar URL
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }
      ])
      .select('*');
  
    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }
  
    setPostContent('');
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Posts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {user ? (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Create Post</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonInput value={postContent} onIonChange={e => setPostContent(e.detail.value!)} placeholder="Write a post..." />
                </IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
                  <IonButton onClick={createPost}>Post</IonButton>
                </div>
              </IonCard>

              {posts.map(post => (
                <IonCard key={post.post_id} style={{ marginTop: '2rem' }}>
                  <IonCardHeader>
                    <IonRow>
                      <IonCol size="1.85">
                        <IonAvatar>
                          <img alt={post.username} src={post.avatar_url} />
                        </IonAvatar>
                      </IonCol>
                      <IonCol>
                        <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                        <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                      </IonCol>
                      <IonCol size="auto">
                        <IonButton
                          fill="clear"
                          onClick={() => toggleFavorite(post.post_id)}
                        >
                          <IonIcon
                            slot="icon-only"
                            icon={favoritePostIds.includes(post.post_id) ? heart : heartOutline}
                            color={favoritePostIds.includes(post.post_id) ? 'danger' : 'medium'}
                          />
                        </IonButton>
                        <IonButton
                          fill="clear"
                          onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                        >
                          <IonIcon color="secondary" icon={pencil} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonText style={{ color: 'black' }}>
                      <h1>{post.post_content}</h1>
                    </IonText>
                  </IonCardContent>

                  <IonPopover
                    isOpen={popoverState.open && popoverState.postId === post.post_id}
                    event={popoverState.event}
                    onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                  >
                    <IonButton fill="clear" onClick={() => { startEditingPost(post); setPopoverState({ open: false, event: null, postId: null }); }}>
                      Edit
                    </IonButton>
                    <IonButton fill="clear" color="danger" onClick={() => { deletePost(post.post_id); setPopoverState({ open: false, event: null, postId: null }); }}>
                      Delete
                    </IonButton>
                  </IonPopover>
                </IonCard>
              ))}
            </>
          ) : (
            <IonLabel>Loading...</IonLabel>
          )}
        </IonContent>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput value={postContent} onIonChange={e => setPostContent(e.detail.value!)} placeholder="Edit your post..." />
          </IonContent>
          <IonFooter>
            <IonButton onClick={savePost}>Save</IonButton>
            <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
          </IonFooter>
        </IonModal>

        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setIsAlertOpen(false)}
          header="Success"
          message="Post updated successfully!"
          buttons={['OK']}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={toastMessage.toLowerCase().includes('error') ? 'danger' : 'success'}
          buttons={[
            {
              text: 'Close',
              role: 'cancel',
            }
          ]}
        />
      </IonPage>
    </IonApp>
  );
};

export default FeedContainer;