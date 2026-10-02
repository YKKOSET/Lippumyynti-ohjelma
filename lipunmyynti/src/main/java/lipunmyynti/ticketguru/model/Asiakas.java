package lipunmyynti.ticketguru.model;



import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity 
@Table (name = "asiakas")

public class Asiakas {

@Id 
@GeneratedValue (strategy = GenerationType.IDENTITY)
private Long id;

@Size(max = 50, message = "Etunimi voi olla enintään 50 merkkiä pitkä.")
private String etunimi;

@Size(max = 100, message = "Sukunimi voi olla enintään 100 merkkiä pitkä.")
private String sukunimi;

@Email (message = "Sähköpostiosoite tulee kirjoittaa oikeassa muodossa")
@Size(max = 300, message = "Sähköpostiosoite voi olla enintään 300 merkkiä pitkä.")
private String sahkoposti;

@Size(max = 20, message = "Puhelinnumero voi olla enintään 20 merkkiä pitkä.")
@Pattern (regexp = "^\\+?[0-9 ]*$", message = "Puhelinnumero voi sisältää vain numeroita")
private String puhelin;

@OneToMany (mappedBy = "asiakas")
private List<Osto> ostot;

public Asiakas() {
}

public Asiakas(String etunimi, String sukunimi, String sahkoposti, String puhelin) {
    this.etunimi = etunimi;
    this.sukunimi = sukunimi;
    this.sahkoposti = sahkoposti;
    this.puhelin = puhelin;
}

public String getEtunimi() {
    return etunimi;
}

public void setEtunimi(String etunimi) {
    this.etunimi = etunimi;
}

public String getSukunimi() {
    return sukunimi;
}

public void setSukunimi(String sukunimi) {
    this.sukunimi = sukunimi;
}

public String getSahkoposti() {
    return sahkoposti;
}

public void setSahkoposti(String sahkoposti) {
    this.sahkoposti = sahkoposti;
}

public String getPuhelin() {
    return puhelin;
}

public void setPuhelin(String puhelin) {
    this.puhelin = puhelin;
}

@Override
public String toString() {
    return "Asiakas [etunimi=" + etunimi + ", sukunimi=" + sukunimi + ", sahkoposti=" + sahkoposti + ", puhelin="
            + puhelin + "]";
}


}
