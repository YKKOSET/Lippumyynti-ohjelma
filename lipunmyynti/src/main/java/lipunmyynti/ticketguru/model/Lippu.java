package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.*;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

//import org.hibernate.annotations.Generated; // for postgre
//import org.hibernate.generator.EventType;   // for postgre

@Entity
@Table(name = "lippu")
public class Lippu {

    @Id
    @GeneratedValue // java generates
    // @Generated(event = EventType.INSERT) // postgre generates
    @Column(name = "tark_nro", updatable = false, nullable = false)
    private UUID id_;

    @NotNull(message = "Hinta on pakollinen")
    @DecimalMin(value = "0.01", message = "Hinnan täytyy olla vähintään 0.01")
    @Digits(integer = 8, fraction = 2, message = "Hinta voi sisältää enintään 2 desimaalia")
    @Column(name = "hinta")
    private BigDecimal hinta_;

    @Column(name = "kaytetty")
    private boolean kaytetty_;

    @Column(name = "ostettu")
    private boolean ostettu_;

    @NotNull(message = "Lipputyyppi on pakollinen")
    @ManyToOne
    @JoinColumn(name = "lipputyyppi_id", nullable = false)
    private Lipputyyppi lipputyyppi_;

    @NotNull(message = "Esityskerta on pakollinen")
    @ManyToOne
    @JoinColumn(name = "esityskerta_id", nullable = false)
    @JsonIgnore
    private Esityskerta esityskerta_;

    // constructors
    public Lippu() {
    }

    public Lippu(Esityskerta esityskerta, Lipputyyppi lipputyyppi, BigDecimal hinta, boolean kaytetty, boolean ostettu) {
        esityskerta_ = esityskerta;
        lipputyyppi_ = lipputyyppi;
        hinta_ = hinta;
        kaytetty_ = kaytetty;
        ostettu_ = ostettu;
    }

    // setters and getters
    public UUID getId() {
        return id_;
    }

    public void setId(UUID id) {
        id_ = id;
    }

    public Esityskerta getEsityskerta() {
        return esityskerta_;
    }

    public void setEsityskerta(Esityskerta esityskerta) {
        esityskerta_ = esityskerta;
    }

    public Lipputyyppi getLipputyyppi() {
        return lipputyyppi_;
    }

    public void setLipputyyppi(Lipputyyppi lipputyyppi) {
        lipputyyppi_ = lipputyyppi;
    }

    public BigDecimal getHinta() {
        return hinta_;
    }

    public void setHinta(BigDecimal hinta) {
        hinta_ = hinta;
    }

    public boolean isKaytetty() {
        return kaytetty_;
    }

    public void setKaytetty(boolean kaytetty) {
        kaytetty_ = kaytetty;
    }

    public boolean isOstettu() {
        return ostettu_;
    }

    public void setOstettu(boolean ostettu_) {
        this.ostettu_ = ostettu_;
    }

    @Override
    public String toString() {
        return "Lippu [id_=" + id_ + ", hinta_=" + hinta_ + ", kaytetty_=" + kaytetty_ + ", ostettu_=" + ostettu_
                + ", lipputyyppi_=" + lipputyyppi_ + ", esityskerta_=" + esityskerta_ + "]";
    }
    
}
