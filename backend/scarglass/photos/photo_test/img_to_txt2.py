from PIL import Image
import pytesseract
from googletrans import Translator

translator = Translator()

image = 'backend/scarglass/photos/photo_test/spanish.png'
text = pytesseract.image_to_string(Image.open(image), lang='eng+fra+spa')
text = text.replace('\n', ' ').replace('\r', ' ')
print("in spanish:", text)
print(type(text))

to_eng = translator.translate(text, dest ='en')
out = to_eng.text.replace('\n', '').replace('\r', '')

print("in english: ", out)

