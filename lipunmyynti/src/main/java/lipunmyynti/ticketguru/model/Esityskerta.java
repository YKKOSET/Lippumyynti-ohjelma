package lipunmyynti.ticketguru.model;

import java.sql.Timestamp;

import jakarta.persistence.*;
import java.util.*;

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

    @OneToMany(mappedBy = "esityskerta_")
    private List<Lippu> liput;


    public Esityskerta() {
    }

    public Esityskerta(Tapahtuma tapahtuma, Timestamp alkuaika) {
        this.tapahtuma = tapahtuma;
        this.alkuaika = alkuaika;
    }

    public Esityskerta(Paikka paikka, Tapahtuma tapahtuma, int maxOsallistujat, Timestamp alkuaika) {
        this.paikka = paikka;
        this.tapahtuma = tapahtuma;
        this.maxOsallistujat = maxOsallistujat;
        this.alkuaika = alkuaika;
    }

    public Paikka getPaikka() {
        return paikka;
    }

    public void setPaikka(Paikka paikka) {
        this.paikka = paikka;
    }

    public Tapahtuma getTapahtuma() {
        return tapahtuma;
    }

    public void setTapahtuma(Tapahtuma tapahtuma) {
        this.tapahtuma = tapahtuma;
    }

    public int getMaxOsallistujat() {
        return maxOsallistujat;
    }

    public void setMaxOsallistujat(int maxOsallistujat) {
        this.maxOsallistujat = maxOsallistujat;
    }

    public Timestamp getAlkuaika() {
        return alkuaika;
    }

    public void setAlkuaika(Timestamp alkuaika) {
        this.alkuaika = alkuaika;
    }

}
