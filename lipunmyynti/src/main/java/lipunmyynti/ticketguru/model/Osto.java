package lipunmyynti.ticketguru.model;

import java.sql.Timestamp;
import java.util.List;

import jakarta.persistence.*;


@Entity 
@Table (name = "osto")

public class Osto {

@Id 
@GeneratedValue (strategy = GenerationType.IDENTITY)
private Long id;

@OneToMany(mappedBy = "osto")
private List<Ostorivi> ostorivit;

private Timestamp ostoaika;
private double kokonaishinta;

@ManyToOne (optional = true) //customer is not necessery
private Asiakas asiakas;

public Osto() {
}

public Osto(Timestamp ostoaika, double kokonaishinta, Asiakas asiakas) {
    this.ostoaika = ostoaika;
    this.kokonaishinta = kokonaishinta;
    this.asiakas = asiakas;
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public Timestamp getOstoaika() {
    return ostoaika;
}

public void setOstoaika(Timestamp ostoaika) {
    this.ostoaika = ostoaika;
}

public double getKokonaishinta() {
    return kokonaishinta;
}

public void setKokonaishinta(double kokonaishinta) {
    this.kokonaishinta = kokonaishinta;
}

public Asiakas getAsiakas() {
    return asiakas;
}

public void setAsiakas(Asiakas asiakas) {
    this.asiakas = asiakas;
}

public List<Ostorivi> getOstorivit() {
    return ostorivit;
}

public void setOstorivit(List<Ostorivi> ostorivit) {
    this.ostorivit = ostorivit;
}

@Override
public String toString() {
    return "Osto [id=" + id + ", ostoaika=" + ostoaika + ", kokonaishinta=" + kokonaishinta + ", asiakas=" + asiakas
            + "]";
}


}
