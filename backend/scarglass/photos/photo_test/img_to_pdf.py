import pytesseract
import cv2
import re

img = "backend/scarglass/photos/photo_test/maths2.png".format() #filepath
text = pytesseract.image_to_string(img, lang='eng+equ')

text.replace(" ", "")
# pattern = re.compile("[0-9]+x[0-9]+")
# equations = [x for x in parsed_text if bool(re.match(pattern, x))]

print(text)
