package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.*;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//import org.hibernate.annotations.Generated; // for postgre
//import org.hibernate.generator.EventType;   // for postgre

@Entity
@Table(name = "lippu")
public class Lippu {

    @Id
    @GeneratedValue // java generates
    // @Generated(event = EventType.INSERT) // postgre generates
    @Column(name = "tark_nro", updatable = false, nullable = false)
    private UUID id;

    @NotNull(message = "Hinta on pakollinen")
    @DecimalMin(value = "0.01", message = "Hinnan täytyy olla vähintään 0.01")
    @Digits(integer = 8, fraction = 2, message = "Hinta voi sisältää enintään 2 desimaalia")
    @Column(name = "hinta")
    private BigDecimal hinta;

    @Column(name = "kaytetty")
    private boolean kaytetty;

    @Column(name = "ostettu")
    private boolean ostettu;

    @NotNull(message = "Lipputyyppi on pakollinen")
    @ManyToOne
    @JoinColumn(name = "lipputyyppi_id", nullable = false)
    private Lipputyyppi lipputyyppi;

    @NotNull(message = "Esityskerta on pakollinen")
    @ManyToOne
    @JoinColumn(name = "esityskerta_id", nullable = false)
    @JsonIgnoreProperties({"liput"})
    private Esityskerta esityskerta;

    // constructors
    public Lippu() {
    }

    public Lippu(Esityskerta esityskerta, Lipputyyppi lipputyyppi, BigDecimal hinta, boolean kaytetty, boolean ostettu) {
        this.esityskerta = esityskerta;
        this.lipputyyppi = lipputyyppi;
        this.hinta = hinta;
        this.kaytetty = kaytetty;
        this.ostettu = ostettu;
    }

    // setters and getters
    public UUID getId() {
        return this.id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Esityskerta getEsityskerta() {
        return this.esityskerta;
    }

    public void setEsityskerta(Esityskerta esityskerta) {
        this.esityskerta = esityskerta;
    }

    public Lipputyyppi getLipputyyppi() {
        return this.lipputyyppi;
    }

    public void setLipputyyppi(Lipputyyppi lipputyyppi) {
        this.lipputyyppi = lipputyyppi;
    }

    public BigDecimal getHinta() {
        return this.hinta;
    }

    public void setHinta(BigDecimal hinta) {
        this.hinta = hinta;
    }

    public boolean isKaytetty() {
        return this.kaytetty;
    }

    public void setKaytetty(boolean kaytetty) {
        this.kaytetty = kaytetty;
    }

    public boolean isOstettu() {
        return this.ostettu;
    }

    public void setOstettu(boolean ostettu) {
        this.ostettu = ostettu;
    }

    @Override
    public String toString() {
        return "Lippu [id_=" + this.id + ", hinta_=" + this.hinta + ", kaytetty_=" + this.kaytetty + ", ostettu_=" + this.ostettu
                + ", lipputyyppi_=" + this.lipputyyppi + ", esityskerta_=" + this.esityskerta + "]";
    }
    
}
