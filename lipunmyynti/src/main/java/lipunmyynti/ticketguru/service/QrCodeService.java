package lipunmyynti.ticketguru.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.encoder.QRCode;
@Service 

public class QrCodeService {

    public byte[] qrgen (String content, int width, int length) throws WriterException, IOException{

        QRCodeWriter writer = new QRCodeWriter(); 
        BitMatrix matrix =writer.encode(content, BarcodeFormat.QR_CODE, width, length);
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);
        
        return out.toByteArray();
    }
}
