import type { ContactApi, DisplayContact, LocatedContact } from '~/types/annuaire'

// Partage entre la page contact et le lecteur d'histoire (fin defavorable) :
// meme filtrage et meme forme d'affichage pour <ContactCard>.

export function isWebsiteOnly(contact: ContactApi) {
  const hasOtherInfo = contact.telephones.length > 0
    || !!contact.mail?.trim()
    || !!contact.horaires?.trim()
    || !!contact.localisation?.trim()
  return !!contact.site_web?.trim() && !hasOtherInfo
}

export function isTerritoryWide(contact: { address: string | null }) {
  return !!contact.address?.toLowerCase().includes('tout le territoire')
}

export function isLocated(contact: DisplayContact): contact is LocatedContact {
  return contact.lat !== null && contact.lng !== null
}

export function toDisplayContacts(contacts: ContactApi[]): DisplayContact[] {
  return contacts.filter(contact => !isWebsiteOnly(contact)).map(contact => ({
    ref: contact.ref,
    name: contact.prenom ? `${contact.prenom} ${contact.nom}` : contact.nom,
    role: contact.remarques,
    email: contact.mail,
    hours: contact.horaires,
    address: contact.localisation,
    website: contact.site_web,
    telephones: contact.telephones,
    lat: contact.latitude,
    lng: contact.longitude,
  })).sort((a, b) => Number(isTerritoryWide(a)) - Number(isTerritoryWide(b)))
}
