import { supabase } from '@/lib/supabase';

export const uploadSoundToCloud = async (file: File, soundType: string, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${soundType}.${fileExt}`;
  
  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('game-sounds')
    .upload(fileName, file, { upsert: true });
  
  if (uploadError) throw uploadError;
  
  // Save reference in database
  const { error: dbError } = await supabase
    .from('user_sounds')
    .upsert({
      user_id: userId,
      sound_type: soundType,
      file_path: fileName,
      file_name: file.name,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,sound_type' });
  
  if (dbError) throw dbError;
  
  return fileName;
};

export const getUserSounds = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_sounds')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  const soundUrls: { [key: string]: string } = {};
  
  for (const sound of data || []) {
    // Use 7 days expiration for signed URLs (604800 seconds)
    const { data: urlData } = await supabase.storage
      .from('game-sounds')
      .createSignedUrl(sound.file_path, 604800);

    
    if (urlData?.signedUrl) {
      soundUrls[sound.sound_type] = urlData.signedUrl;
    }
  }
  
  return soundUrls;
};

export const deleteSoundFromCloud = async (soundType: string, userId: string) => {
  const { data } = await supabase
    .from('user_sounds')
    .select('file_path')
    .eq('user_id', userId)
    .eq('sound_type', soundType)
    .single();
  
  if (data?.file_path) {
    await supabase.storage.from('game-sounds').remove([data.file_path]);
  }
  
  await supabase.from('user_sounds').delete().eq('user_id', userId).eq('sound_type', soundType);
};
