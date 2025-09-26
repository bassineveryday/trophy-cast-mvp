-- Update the handle_new_user function to include signature_techniques
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, club, avatar_url, signature_techniques)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'club', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data ->> 'signature_techniques' IS NOT NULL 
        THEN string_to_array(NEW.raw_user_meta_data ->> 'signature_techniques', ',')
        ELSE '{}'::text[]
      END
    )
  );
  RETURN NEW;
END;
$function$;