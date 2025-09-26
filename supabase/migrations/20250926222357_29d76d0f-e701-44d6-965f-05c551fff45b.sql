-- Fix the handle_new_user function to properly handle signature_techniques array from JSON
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  techniques_json text;
  techniques_array text[];
BEGIN
  -- Get the signature_techniques from raw_user_meta_data
  techniques_json := NEW.raw_user_meta_data ->> 'signature_techniques';
  
  -- Parse the JSON array if it exists
  IF techniques_json IS NOT NULL AND techniques_json != '' THEN
    BEGIN
      -- Try to parse as JSON array
      SELECT ARRAY(SELECT json_array_elements_text(techniques_json::json))
      INTO techniques_array;
    EXCEPTION
      WHEN OTHERS THEN
        -- If parsing fails, default to empty array
        techniques_array := '{}';
    END;
  ELSE
    techniques_array := '{}';
  END IF;

  INSERT INTO public.profiles (user_id, name, club, avatar_url, signature_techniques)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'club', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    techniques_array
  );
  RETURN NEW;
END;
$function$;