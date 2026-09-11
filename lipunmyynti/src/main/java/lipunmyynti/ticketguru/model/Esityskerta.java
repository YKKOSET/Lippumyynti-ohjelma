package lipunmyynti.ticketguru.model;
import java.sql.Timestamp;

import jakarta.persistence.*;

@Entity
@Table(name = "esityskerta")
public class Esityskerta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Paikka paikka;
    
    @ManyToOne
    private Tapahtuma tapahtuma;
    private int maxOsallistujat;
    private Timestamp alkuaika;


    public Esityskerta() {
    }

    public Esityskerta(Paikka paikka, TapahtumaId tapahtumaId, int maxOsallistujat, Timestamp alkuaika) {
        this.paikka = paikka;
        this.tapahtumaId = tapahtumaId;
        this.maxOsallistujat = maxOsallistujat;
        this.alkuaika = alkuaika;
    }

    public Long getId() {
        return id;
    }

    public Paikka getPaikka() {
        return paikka;
    }

    public TapahtumaId getTapahtumaId() {
        return tapahtumaId;
    }

    public int getMaxOsallistujat() {
        return maxOsallistujat;
    }

    public Timestamp getAlkuaika() {
        return alkuaika;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPaikka(Paikka paikka) {
        this.paikka = paikka;
    }

    public void setTapahtumaId(TapahtumaId tapahtumaId) {
        this.tapahtumaId = tapahtumaId;
    }

    public void setMaxOsallistujat(int maxOsallistujat) {
        this.maxOsallistujat = maxOsallistujat;
    }

    public void setAlkuaika(Timestamp alkuaika) {
        this.alkuaika = alkuaika;
    }

    @Override
    public String toString() {
        return "Esityskerta [id=" + id + ", paikka=" + paikka + ", tapahtumaId=" + tapahtumaId + ", maxOsallistujat="
                + maxOsallistujat + ", alkuaika=" + alkuaika + "]";
    }
}

