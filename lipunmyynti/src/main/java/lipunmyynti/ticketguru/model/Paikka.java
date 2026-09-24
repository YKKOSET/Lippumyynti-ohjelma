package lipunmyynti.ticketguru.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "paikka")
public class Paikka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nimi;
    private String katuosoite;

    @ManyToOne
    @JoinColumn(name = "postinumero")
    private Postinumero postinumero;

    @OneToMany(mappedBy = "paikka")
    private List<Esityskerta> esityskerrat;

    public Paikka() {
    }

    public Paikka(Long id, String nimi, String katuosoite, Postinumero postinumero) {
        this.id = id;
        this.nimi = nimi;
        this.katuosoite = katuosoite;
        this.postinumero = postinumero;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNimi() {
        return nimi;
    }

    public void setNimi(String nimi) {
        this.nimi = nimi;
    }

    public String getKatuosoite() {
        return katuosoite;
    }

    public void setKatuosoite(String katuosoite) {
        this.katuosoite = katuosoite;
    }

    public Postinumero getPostinumero() {
        return postinumero;
    }

    public void setPostinumero(Postinumero postinumero) {
        this.postinumero = postinumero;
    }

    public List<Esityskerta> getEsityskerrat() {
        return esityskerrat;
    }

    public void setEsityskerrat(List<Esityskerta> esityskerrat) {
        this.esityskerrat = esityskerrat;
    }

    @Override
    public String toString() {
        return "Paikka [id=" + id
                + ", nimi=" + nimi
                + ", katuosoite=" + katuosoite
                + ", postinumero=" + postinumero + "]";
    }
}