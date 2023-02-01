from PIL import Image
import pytesseract
from googletrans import Translator

def translate(image):
  translator = Translator()
  text = pytesseract.image_to_string(Image.open(image), lang='eng+fra+spa')

  text = text.replace('\n', ' ').replace('\r', ' ')
  print("in fr:", text)

  to_eng = translator.translate(text, dest='en')
  out = to_eng.text.replace('\n', '').replace('\r', '')

  print("in english: ", out)
  return out

