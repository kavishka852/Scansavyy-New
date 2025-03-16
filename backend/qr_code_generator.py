import qrcode


def generate_qr_console(data: str):
    """
    Generates a QR code for the given data and prints it in the console.

    :param data: The text or URL to encode in the QR code.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=3,  # Adjust for better visibility
        border=1,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Convert QR Code to ASCII
    qr_console = qr.make_image(fill="black", back_color="white")
    qr_console.show()  # Displays as an image in terminal (optional)

    # Print as ASCII in the console
    qr_matrix = qr.get_matrix()
    for row in qr_matrix:
        print("".join("██" if pixel else "  " for pixel in row))  # Uses block characters for better visibility


# Example usage
generate_qr_console("67bb20e3c880a684a22888e8")
