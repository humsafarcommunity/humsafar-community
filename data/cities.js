// Cities for the "Manali tour packages from ..." pages (/manali-tour-packages/[city]).
// Keep the facts here plain and checkable. Flight times are rough, so they are worded that way.
export const CITIES = {
  mumbai: {
    name: "Mumbai",
    intro: "Planning Manali from Mumbai? Our group trips leave from Delhi, so you fly to Delhi, join the batch and travel on with the group. It keeps the trip cheap, because you only pay for one short flight instead of a whole private package.",
    reach: "A flight from Mumbai to Delhi takes roughly two hours and runs many times a day. Trains take much longer. Reach Delhi the day before your batch leaves, so a late flight does not make you miss the pickup.",
  },
  pune: {
    name: "Pune",
    intro: "From Pune, the easiest way to Manali with us is to fly to Delhi and join the group there. You travel with a trip captain and a batch of other travellers, with the stays and road travel from Delhi planned for you.",
    reach: "A flight from Pune to Delhi takes roughly two hours. Book your flight to land in Delhi the day before the batch leaves, so you start the trip rested.",
  },
  bangalore: {
    name: "Bangalore",
    intro: "Bangalore to Manali is a long way, so the smart plan is one flight to Delhi and then the group trip from there. You skip the hassle of arranging buses, stays and a driver in the mountains yourself.",
    reach: "A flight from Bangalore to Delhi takes roughly two and a half to three hours. Land in Delhi the day before your batch leaves, so you are not rushing to the pickup point.",
  },
  hyderabad: {
    name: "Hyderabad",
    intro: "Travelling to Manali from Hyderabad? Fly to Delhi, join our batch and let us handle the road travel, the stays and the plan. It works well for friends, couples and solo travellers.",
    reach: "A flight from Hyderabad to Delhi takes roughly two hours. Plan to arrive in Delhi the day before your batch departs.",
  },
  ahmedabad: {
    name: "Ahmedabad",
    intro: "From Ahmedabad, Delhi is a short flight away, and that is where our Manali group trips begin. Join a batch, meet your trip captain and travel to the mountains with the group.",
    reach: "A flight from Ahmedabad to Delhi takes under two hours. Arrive in Delhi the day before your batch leaves.",
  },
  gwalior: {
    name: "Gwalior",
    intro: "Humsafar Community is based in Gwalior, so many of our travellers start here. Our Manali batches leave from Delhi, and we are happy to help you plan how to join from Gwalior.",
    reach: "Trains connect Gwalior and Delhi and take a few hours. Ask us on WhatsApp if a Gwalior pickup is possible for the batch you want, and we will tell you the best way to join.",
  },
};

export const CITY_SLUGS = Object.keys(CITIES);
