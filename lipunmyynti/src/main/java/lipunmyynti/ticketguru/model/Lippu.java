package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.*;
import java.math.*;
import java.util.*;




@Entity
@Table(name = "lippu")
public class Lippu 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_;

    @NotNull(message = "Hinta on pakollinen")
    @DecimalMin(value = "0.01", message = "Hinnan täytyy olla vähintään 0.01")
    @Digits(integer = 8, fraction = 2, message = "Hinta voi sisältää enintään 2 desimaalia")
    private BigDecimal hinta_;

    private boolean kaytetty_;

    @NotNull(message = "Lipputyyppi on pakollinen")
    @ManyToOne
    @JoinColumn(name = "tyyppiId", nullable = false)
    private Lipputyyppi lipputyyppi_;

    @NotNull(message = "Esityskerta on pakollinen")
    @ManyToOne
    @JoinColumn(name = "esitysId", nullable = false)
    private Esityskerta esityskerta_;


    //constructors
    public Lippu()                                              {}

    public Lippu(Esityskerta esityskerta, Lipputyyppi lipputyyppi, BigDecimal hinta, boolean kaytetty)
    {
        esityskerta_ = esityskerta;
        lipputyyppi_ = lipputyyppi;
        hinta_ = hinta;
        kaytetty_ = kaytetty;
    }


    //setters and getters
    public Long getId()                                         { return id_; }

    public void setId(Long id)                                  { id_ = id; }

    public Esityskerta getEsityskerta()                         { return esityskerta_; }

    public void setEsityskerta(Esityskerta esityskerta)         { esityskerta_ = esityskerta; }

    public Lipputyyppi getLipputyyppi()                         { return lipputyyppi_; }

    public void setLipputyyppi(Lipputyyppi lipputyyppi)         { lipputyyppi_ = lipputyyppi; }

    public BigDecimal getHinta()                                { return hinta_; }

    public void setHinta(BigDecimal hinta)                      { hinta_ = hinta; }

    public boolean isKaytetty()                                 { return kaytetty_; }

    public void setKaytetty(boolean kaytetty)                   { kaytetty_ = kaytetty; }


    //to string method
    @Override
    public String toString() 
    {
        return "Lippu [id_=" + id_ + ", esityskerta_=" + esityskerta_ + ", Lipputyyppi_=" + lipputyyppi_ + ", hinta_=" + hinta_
                + ", kaytetty_=" + kaytetty_ + "]";
    }
}
