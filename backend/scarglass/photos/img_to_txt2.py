from PIL import Image
import pytesseract
from googletrans import Translator
# from google_trans_new import google_translator  

def translate(image):
  translator = Translator()
  # translator = google_translator() 

  # image = 'backend/scarglass/photos/photo_test/french2_photo.png' #img location
  text = pytesseract.image_to_string(Image.open(image), lang='eng+fra+spa')

  text = text.replace('\n', ' ').replace('\r', ' ')
  print("in fr:", text)

  to_eng = translator.translate(text, lang_tgt='en')
  out = to_eng.text.replace('\n', '').replace('\r', '')

  print("in english: ", out)
  return out

