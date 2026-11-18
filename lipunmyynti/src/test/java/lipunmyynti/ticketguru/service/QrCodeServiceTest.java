package lipunmyynti.ticketguru.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.ByteArrayInputStream;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.Test;

class QrCodeServiceTest {

    private final QrCodeService service = new QrCodeService();

    @Test
    void qrgenReturnsPngWithRequestedSize() throws Exception {
        byte[] png = service.qrgen(UUID.randomUUID().toString(), 300, 300);

        assertThat(png).isNotEmpty();
        // PNG-tiedoston alkutavut
        assertThat(png[0]).isEqualTo((byte) 0x89);
        assertThat(png[1]).isEqualTo((byte) 'P');
        assertThat(png[2]).isEqualTo((byte) 'N');
        assertThat(png[3]).isEqualTo((byte) 'G');

        var image = ImageIO.read(new ByteArrayInputStream(png));
        assertThat(image.getWidth()).isEqualTo(300);
        assertThat(image.getHeight()).isEqualTo(300);
    }

    @Test
    void qrgenWorksWithDifferentSize() throws Exception {
        byte[] png = service.qrgen("testi", 100, 100);
        var image = ImageIO.read(new ByteArrayInputStream(png));
        assertThat(image.getWidth()).isEqualTo(100);
        assertThat(image.getHeight()).isEqualTo(100);
    }
}
