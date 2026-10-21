package lipunmyynti.ticketguru.model;

import java.sql.Timestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "esityskerta")
public class Esityskerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "esityskerta_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paikka_id")
    private Paikka paikka;

    @ManyToOne
    @JoinColumn(name = "tapahtuma_id")
    @JsonIgnore 
    private Tapahtuma tapahtuma;

    @Column(name = "max_osallistujat")
    private int maxOsallistujat;

    @NotNull (message = "Alkuaika on pakollinen.")
    @Future(message = "Alkuaika ei voi olla menneisyydessä.")
    @Column(name = "alkuaika")
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
