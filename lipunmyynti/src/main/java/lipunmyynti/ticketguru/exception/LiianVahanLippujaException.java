package lipunmyynti.ticketguru.exception;

/** Näytetään, kun esityskerralla ei ole tarpeeksi vapaita paikkoja (lippuja yritetään luoda tai myydä enemmän kuin maxOsallistujat sallii). */

public class LiianVahanLippujaException extends RuntimeException {

    public LiianVahanLippujaException() {
        super("Lippuja ei ole tarpeeksi");
    }

    public LiianVahanLippujaException(String viesti) {
        super(viesti);
    }
}
