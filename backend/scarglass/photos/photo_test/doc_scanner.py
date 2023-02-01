from imutils.perspective import four_point_transform
import cv2

height = 800
width = 600
green = (0, 255, 0)

impath = ""

image = cv2.imread(impath)
image = cv2.resize(image, (width, height))
orig_image = image.copy()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) # convert the image to gray scale
blur = cv2.GaussianBlur(gray, (5, 5), 0) # Add Gaussian blur
edged = cv2.Canny(blur, 75, 200) # Apply the Canny algorithm to find the edges

# Show the image and the edges
cv2.imshow('Original image:', image)
cv2.imshow('Edged:', edged)
cv2.waitKey(0)
cv2.destroyAllWindows()