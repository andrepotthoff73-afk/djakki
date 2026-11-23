import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Datenschutz – DJ Akki & Friends',
  description: 'Datenschutzerklärung von DJ Akki & Friends, Agentur Weyand, Moers.',
}

// Datenschutzerklärung: allgemeine Teile von der bisherigen djakki.de (Vorlage eRecht24) übernommen,
// technische Abschnitte an die neue Seite angepasst (Hosting bei Vercel, keine Analyse, keine eingebetteten Dienste)
export default function Datenschutz() {
  const { address, phone, phoneHref } = site.contact

  return (
    <LegalLayout title="Datenschutz­erklärung">
      <h2>1. Datenschutz auf einen Blick</h2>
      <h3>Allgemeine Hinweise</h3>
      <p>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn
        Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden
        können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
        Datenschutzerklärung.
      </p>
      <h3>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
      <p>
        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem
        Abschnitt „Hinweis zur verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.
      </p>
      <h3>Wie erfassen wir Ihre Daten?</h3>
      <p>
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen, etwa wenn Sie uns per E-Mail, Telefon
        oder WhatsApp eine Anfrage schicken. Andere Daten werden beim Besuch der Website automatisch durch die IT-Systeme
        unseres Hosters erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des
        Seitenaufrufs).
      </p>
      <h3>Wofür nutzen wir Ihre Daten?</h3>
      <p>
        Die Daten werden erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten und Ihre Anfragen zu
        bearbeiten. Eine Analyse Ihres Nutzerverhaltens findet nicht statt; wir setzen keine Analyse- oder Werbe-Tools ein.
      </p>
      <h3>Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
      <p>
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten
        personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu
        verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für
        die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung
        Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
        Aufsichtsbehörde zu. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
      </p>

      <h2>2. Hosting</h2>
      <p>
        Diese Website wird bei einem externen Dienstleister gehostet: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA
        91723, USA. Die personenbezogenen Daten, die beim Besuch der Website anfallen, werden auf den Servern von Vercel
        verarbeitet. Hierbei handelt es sich vor allem um IP-Adressen, Meta- und Kommunikationsdaten sowie Websitezugriffe
        (siehe „Server-Log-Dateien“). Bilder für die Website, auch Fotos von www.djakki.de und Vorschaubilder verlinkter
        Presseartikel, werden über den Bilddienst von Vercel ausgeliefert; Ihr Browser baut dafür keine Verbindung zu den
        Servern der jeweiligen Quelle auf. Flyer für die nächsten Veranstaltungen speichern wir im Speicherdienst von Vercel
        (Rechenzentrum Frankfurt am Main).
      </p>
      <p>
        Der Einsatz des Hosters erfolgt im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres
        Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Vercel kann Daten in die USA
        übermitteln. Vercel ist nach dem EU-US Data Privacy Framework zertifiziert; die Übermittlung stützt sich damit auf den
        Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO) und ergänzend auf die Standardvertragsklauseln der
        EU-Kommission. Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel:{' '}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="link">
          vercel.com/legal/privacy-policy
        </a>
        .
      </p>
      <h3>Auftragsverarbeitung</h3>
      <p>
        Mit Vercel besteht ein Vertrag über Auftragsverarbeitung (Data Processing Addendum). Hierbei handelt es sich um einen
        datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass Vercel die personenbezogenen Daten unserer
        Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
      </p>

      <h2>3. Allgemeine Hinweise und Pflicht­informationen</h2>
      <h3>Datenschutz</h3>
      <p>
        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
        personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
        Datenschutzerklärung. Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per
        E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht
        möglich.
      </p>
      <h3>Hinweis zur verantwortlichen Stelle</h3>
      <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
      <p>
        {site.legalEntity}
        <br />
        {address.street}
        <br />
        {address.zip} {address.city}
        <br />
        Telefon:{' '}
        <a href={phoneHref} className="link">
          {phone}
        </a>
        <br />
        E-Mail:{' '}
        <a href="mailto:akki@agentur-weyand.de" className="link">
          akki@agentur-weyand.de
        </a>
      </p>
      <p>
        Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die
        Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
      </p>
      <h3>Speicherdauer</h3>
      <p>
        Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre
        personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes
        Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht,
        sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B.
        steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser
        Gründe.
      </p>
      <h3>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website</h3>
      <p>
        Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von
        Art. 6 Abs. 1 lit. a DSGVO. Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen
        erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir
        Ihre Daten, sofern diese zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind, auf Grundlage von Art. 6
        Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs.
        1 lit. f DSGVO erfolgen. Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen
        dieser Datenschutzerklärung informiert.
      </p>
      <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
      <p>
        Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits
        erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt
        vom Widerruf unberührt.
      </p>
      <h3>Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</h3>
      <p>
        WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT,
        AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN
        WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE
        RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH
        EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN
        ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN
        ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART.
        21 ABS. 1 DSGVO).
      </p>
      <p>
        WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT
        WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN;
        DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN,
        WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH
        ART. 21 ABS. 2 DSGVO).
      </p>
      <h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
      <p>
        Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde,
        insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen
        Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher
        Rechtsbehelfe.
      </p>
      <h3>Recht auf Datenübertragbarkeit</h3>
      <p>
        Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert
        verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern
        Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es
        technisch machbar ist.
      </p>
      <h3>SSL- bzw. TLS-Verschlüsselung</h3>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw.
        TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers mit
        „https://“ beginnt, und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert
        ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
      </p>
      <h3>Auskunft, Löschung und Berichtigung</h3>
      <p>
        Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre
        gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein
        Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten
        können Sie sich jederzeit an uns wenden.
      </p>
      <h3>Recht auf Einschränkung der Verarbeitung</h3>
      <p>
        Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie
        sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:
      </p>
      <ul>
        <li>
          Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel
          Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer
          personenbezogenen Daten zu verlangen.
        </li>
        <li>
          Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt der Löschung
          die Einschränkung der Datenverarbeitung verlangen.
        </li>
        <li>
          Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder
          Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die Einschränkung der
          Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
        </li>
        <li>
          Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren
          Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die
          Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
        </li>
      </ul>
      <p>
        Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – von ihrer
        Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder Verteidigung von
        Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines
        wichtigen öffentlichen Interesses der Europäischen Union oder eines Mitgliedstaats verarbeitet werden.
      </p>
      <h3>Widerspruch gegen Werbe-E-Mails</h3>
      <p>
        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich
        angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich
        ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails,
        vor.
      </p>

      <h2>4. Datenerfassung auf dieser Website</h2>
      <h3>Cookies und Speicher im Browser</h3>
      <p>
        Für Besucherinnen und Besucher setzt diese Website keine Cookies und keine Tracking- oder Werbetechnologien ein. Im
        lokalen Speicher Ihres Browsers (Local Storage) legt sie höchstens zwei Einträge ab, die keine personenbezogenen Daten
        enthalten und nicht an uns übertragen werden:
      </p>
      <ul>
        <li>
          „djakki-consent“ (notwendig): speichert Ihre Auswahl in der Privatsphäre-Einblendung, damit diese nicht bei jedem
          Besuch erneut erscheint. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG.
        </li>
        <li>
          „djakki-video-intro“ (Komfort, nur mit Ihrer Einwilligung): merkt sich, dass Sie das Video-Intro gesehen haben,
          damit es nicht bei jedem Besuch erneut startet. Rechtsgrundlage ist Ihre Einwilligung nach § 25 Abs. 1 TDDDG und
          Art. 6 Abs. 1 lit. a DSGVO.
        </li>
      </ul>
      <p>
        Ihre Auswahl können Sie jederzeit über „Privatsphäre-Einstellungen“ im Seitenfuß ändern oder widerrufen; ein Widerruf
        löscht den Komfort-Eintrag. Beide Einträge lassen sich außerdem über die Einstellungen Ihres Browsers löschen.
      </p>
      <p>
        Lediglich im passwortgeschützten Verwaltungsbereich der Website wird für den Betreiber ein technisch notwendiges
        Anmelde-Cookie gesetzt.
      </p>
      <h3>Server-Log-Dateien</h3>
      <p>
        Der Hoster der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr
        Browser automatisch übermittelt. Dies sind:
      </p>
      <ul>
        <li>Browsertyp und Browserversion</li>
        <li>verwendetes Betriebssystem</li>
        <li>Referrer-URL</li>
        <li>Hostname des zugreifenden Rechners</li>
        <li>Uhrzeit der Serveranfrage</li>
        <li>IP-Adresse</li>
      </ul>
      <p>
        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt
        auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch
        fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
      </p>
      <h3>Anfrageformular</h3>
      <p>
        Das Anfrageformular auf dieser Website überträgt keine Daten an uns oder an unseren Hoster. Es stellt aus Ihren
        Angaben lediglich eine E-Mail zusammen und öffnet diese in Ihrem E-Mail-Programm. Erst wenn Sie diese E-Mail selbst
        absenden, erhalten wir Ihre Anfrage; es gilt dann der folgende Abschnitt.
      </p>
      <h3>Anfrage per E-Mail, Telefon oder WhatsApp</h3>
      <p>
        Wenn Sie uns per E-Mail, Telefon oder WhatsApp kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden
        personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und
        verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
      </p>
      <p>
        Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der
        Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen
        übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
        gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern
        diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.
      </p>
      <p>
        Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern,
        Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach
        abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen – insbesondere gesetzliche
        Aufbewahrungsfristen – bleiben unberührt.
      </p>
      <p>
        Für Nachrichten per WhatsApp gilt zusätzlich: WhatsApp wird von der WhatsApp Ireland Limited, Merrion Road, Dublin 4,
        D04 X2K5, Irland, betrieben. Der Link auf unserer Website öffnet WhatsApp erst, wenn Sie ihn anklicken; vorher werden
        keine Daten an WhatsApp übertragen. Weitere Informationen finden Sie in der Datenschutzerklärung von WhatsApp:{' '}
        <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noreferrer" className="link">
          whatsapp.com/legal/privacy-policy-eea
        </a>
        .
      </p>

      <h2>5. Schriftarten und externe Links</h2>
      <h3>Schriftarten (lokales Hosting)</h3>
      <p>
        Diese Seite nutzt zur einheitlichen Darstellung die Schriftarten Inter und Cormorant Garamond aus dem Angebot von
        Google Fonts. Die Schriften werden direkt von unserem Hoster ausgeliefert. Eine Verbindung zu Servern von Google
        findet dabei nicht statt.
      </p>
      <h3>Links zu sozialen Netzwerken, Ticketshop und Presseartikeln</h3>
      <p>
        Auf dieser Website finden Sie einfache Links zu unseren Auftritten bei Facebook und Instagram (Meta Platforms Ireland
        Limited, Merrion Road, Dublin 4, D04 X2K5, Irland), zu unserem Ticketshop bei ticket.io sowie zu Presseartikeln der
        WAZ. Es handelt sich nicht um eingebettete Inhalte oder Plugins: Beim Besuch unserer Website werden keine Daten an
        diese Anbieter übertragen. Erst wenn Sie einen Link anklicken, verlassen Sie unsere Website; für die Verarbeitung
        Ihrer Daten auf der aufgerufenen Seite ist dann der jeweilige Anbieter verantwortlich.
      </p>

      <p className="text-sm text-ink-2">Quelle der allgemeinen Abschnitte: eRecht24</p>
    </LegalLayout>
  )
}
