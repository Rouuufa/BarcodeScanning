import cv2
import barcode
from barcode.writer import ImageWriter

# Define the text to encode
text = "UR3UBYHTKP5054357"

# Generate the barcode
barcode_img = barcode.Code128(text, writer=ImageWriter()).render()

# Save the barcode image
barcode_img.save("encoded_barcode.png")

# Display the barcode image using OpenCV
barcode_img_cv = cv2.imread("encoded_barcode.png")
cv2.imshow("Barcode", barcode_img_cv)
cv2.waitKey(0)
cv2.destroyAllWindows()