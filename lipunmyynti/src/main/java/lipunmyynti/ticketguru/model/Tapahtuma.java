package lipunmyynti.ticketguru.model;

import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "tapahtuma")
public class Tapahtuma {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nimi;

    @ManyToOne
    private Long jarjestajaId;
    
    @OneToMany(mappedBy = "tapahtuma")
    private List<Esityskerta> esityskerrat;

    public Tapahtuma() {
    }

    public Tapahtuma(String nimi) {
        this.nimi = nimi;
    }

    public Tapahtuma(String nimi, Long jarjestajaId) {
        this.nimi = nimi;
        this.jarjestajaId = jarjestajaId;
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

    public Long getJarjestajaId() {
        return this.jarjestajaId;
    }

    public void setJarjestajaID(Long jarjestajaId) {
        this.jarjestajaId = jarjestajaId;
    }

    public List<Esityskerta> getEsityskerrat() {
        return esityskerrat;
    }

    public void setEsityskerrat(List<Esityskerta> esityskerrat) {
        this.esityskerrat = esityskerrat;
    }

    @Override
    public String toString() {
        return "Tapahtuma [id=" + id + ", nimi=" + nimi + ", jarjestajaID=" + jarjestajaId + ", esityskerrat="
                + esityskerrat + "]";
    }
}
