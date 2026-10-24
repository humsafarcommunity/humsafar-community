// Destination landing pages: /spiti-tour-packages, /kasol-tour-packages, /jibhi-tour-packages
// (and the same with /<city> on the end). Keep the facts plain and checkable.
export const DESTINATIONS = {
  spiti: {
    slug: "spiti",
    name: "Spiti Valley",
    short: "Spiti",
    keywords: ["spiti"],
    heroLine: "Humsafar Community runs Spiti Valley group tours with a trip captain, so you cross the high passes with a batch instead of arranging a driver and stays on your own.",
    covers: [
      "Spiti is a cold desert in Lahaul and Spiti district, Himachal Pradesh. Kaza is the main town and the usual base. Most circuits include Key Monastery, Kibber, Langza, Hikkim (home of a well-known high-altitude post office), Chicham bridge and Dhankar.",
      "Many circuits start in Manali and cross the Atal Tunnel and Kunzum Pass, and come back through Kinnaur. Chandratal Lake is a popular stop in the warmer months, when the road is open.",
    ],
    faqs: [
      { q: "What is the best time to visit Spiti Valley?", a: "For the full circuit via Manali, late May or June to September or early October is the usual window, because the high passes are open. Winter brings snow and very cold nights, and some roads close. Check current road status before you travel." },
      { q: "How many days are needed for a Spiti Valley trip?", a: "A comfortable Spiti circuit takes 8 to 10 days including travel from Delhi. Shorter trips skip stops or rush the altitude gain, which is not good for your body." },
      { q: "Is altitude sickness a risk in Spiti?", a: "It can be. Kaza is at about 3,800 metres, and some villages are higher. Go slowly, drink water, avoid alcohol on the first days and tell your trip captain at once if you have a headache, nausea or breathlessness. Talk to your doctor before the trip if you have a heart or lung condition." },
      { q: "Can solo travellers and girls join a Spiti group trip?", a: "Yes. Our batches are open to solo travellers, and a trip captain travels with the group, so you do not need to bring friends." },
    ],
  },
  kasol: {
    slug: "kasol",
    name: "Kasol",
    short: "Kasol",
    keywords: ["kasol", "parvati", "kheerganga"],
    heroLine: "Humsafar Community runs Kasol group trips for friends, couples and solo travellers, with stays, road travel and a trip captain taken care of.",
    covers: [
      "Kasol sits on the Parvati river in the Parvati Valley, in Kullu district. Most travellers pair it with Manikaran, known for its hot springs and gurudwara, the village of Tosh, and the Kheerganga trek.",
      "Kasol is easy to combine with Manali or Jibhi on one trip, which is why many of our Himachal batches include it.",
    ],
    faqs: [
      { q: "What is the best time to visit Kasol?", a: "March to June and September to November are pleasant for walks and treks. December to February is cold and can bring snow, and July and August bring heavy rain and landslides on the roads." },
      { q: "How many days are enough for Kasol?", a: "A weekend gives you Kasol and Manikaran. Add one more day for Tosh, and two extra days if you want the Kheerganga trek." },
      { q: "Is Kasol safe for solo travellers and groups of girls?", a: "Kasol is a busy tourist town and most visitors have a good time, but use normal care: stay in verified stays, avoid isolated trails after dark and keep your group informed. On our trips a trip captain travels with you." },
      { q: "How do I reach Kasol?", a: "The nearest airport is Bhuntar, and most travellers come by road from Delhi, Chandigarh or Manali. Our group trips handle the road travel from Delhi." },
    ],
  },
  jibhi: {
    slug: "jibhi",
    name: "Jibhi and Tirthan Valley",
    short: "Jibhi",
    keywords: ["jibhi", "tirthan", "jalori"],
    heroLine: "Humsafar Community runs Jibhi and Tirthan Valley group trips for travellers who want forest, rivers and quiet villages instead of crowded hill towns.",
    covers: [
      "Jibhi is a small village in the Tirthan Valley, in Kullu district. Popular stops include Jibhi waterfall, Jalori Pass, Serolsar Lake and the walks around Tirthan river. The Great Himalayan National Park is nearby.",
      "Jibhi is quieter than Manali or Kasol and is often described as offbeat, though it has become better known in recent years. It pairs well with Manali on a longer Himachal trip.",
    ],
    faqs: [
      { q: "What is the best time to visit Jibhi?", a: "March to June and September to November are good for walks and views. Winter is cold with some snow near Jalori Pass, and the monsoon brings rain and slippery roads." },
      { q: "How many days are enough for Jibhi?", a: "Two to three days cover the waterfall, Jalori Pass and Serolsar Lake at an easy pace. Many travellers add it to a Manali trip." },
      { q: "How do I reach Jibhi?", a: "Jibhi is about a half-day drive from Manali or Kullu through Banjar. Our group trips handle the road travel." },
    ],
  },
};

export const DEST_SLUGS = Object.keys(DESTINATIONS);
