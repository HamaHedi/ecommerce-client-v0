// Catalogue des teintes : une entrée par nuance, avec son nom et sa référence.
//
// La référence d'une teinte est le nom de son image ('/anea/10.2.png' -> '10.2').
// C'est vrai tel quel pour Anea, dont les fichiers portent déjà le code nuancier.
// Les fichiers Togethair sont numérotés séquentiellement (1.png … 67.png) et ne
// correspondent pas au code imprimé sur la mèche : la référence ci-dessous est
// celle relevée sur le nuancier (cf. /TOGETHAIR.pdf), l'image reste le fichier.

import {
	naturel,
	froid,
	chaud,
	cendre,
	dore,
	irise,
	doré,
	doréCendre,
	cuivre,
	acajou,
	mat,
	beige,
	rouge,
	rougeCuivre,
	rougeViolin,
	brun,
	superr,
	metalic,
	metalicViolet,
	mix,
} from "./constants";

// '/anea/10.2.png' -> '10.2'
export const refFromImage = (src) =>
	String(src || "")
		.split("/")
		.pop()
		.replace(/\.(png|jpe?g|webp)$/i, "");

// "NATURELS NEUTRE" -> "Naturels neutre"
const prettyGroup = (name) =>
	String(name || "").charAt(0).toUpperCase() +
	String(name || "").slice(1).toLowerCase();

const ANEA_GROUPS = [
	naturel,
	froid,
	chaud,
	cendre,
	irise,
	dore,
	doré,
	doréCendre,
	cuivre,
	acajou,
	mat,
	beige,
	rouge,
	rougeCuivre,
	rougeViolin,
	brun,
	superr,
	metalic,
	metalicViolet,
	mix,
];

// Anea ne nomme pas ses nuances individuellement : le nom affiché est la famille
// de tons (Doré, Acajou, Cendre…) et la référence le code de la mèche.
export const ANEA_TEINTES = ANEA_GROUPS.flatMap((group) =>
	(group?.colors || []).map((img) => ({
		img,
		reference: refFromImage(img),
		name: prettyGroup(group.name),
		group: prettyGroup(group.name),
	}))
).filter(
	(teinte, index, all) =>
		all.findIndex((t) => t.reference === teinte.reference) === index
);

const TG = (file, reference, name, group) => ({
	img: `/togethair/${file}`,
	reference,
	name,
	group,
});

// Relevé sur les mèches du dossier /public/togethair (code + nom imprimés).
// Les doublons du dossier (16, 35, 46, 53, 65) sont volontairement écartés.
export const TOGETHAIR_TEINTES = [
	TG("1.png", "1", "Noir", "Naturels"),
	TG("2.png", "3", "Chatain foncé", "Naturels"),
	TG("3.png", "4", "Chatain naturel", "Naturels"),
	TG("4.png", "5", "Chatain clair naturel", "Naturels"),
	TG("5.png", "6", "Blond foncé naturel", "Naturels"),
	TG("6.png", "7", "Blond naturel", "Naturels"),
	TG("7.png", "8", "Blond clair naturel", "Naturels"),
	TG("8.png", "9", "Blond très clair naturel", "Naturels"),
	TG("9.png", "10", "Blond platine", "Naturels"),
	TG("10.png", "66", "Blond foncé intense", "Naturels"),
	TG("11.png", "77", "Blond intense", "Naturels"),
	TG("12.png", "88", "Blond clair intense", "Naturels"),

	TG("13.png", "5.1", "Chatain clair cendré", "Cendrés"),
	TG("14.png", "6.1", "Blond foncé cendré", "Cendrés"),
	TG("15.png", "7.1", "Blond cendré", "Cendrés"),
	TG("22.png", "8.1", "Blond clair cendré", "Cendrés"),
	TG("20.png", "9.1", "Blond très clair cendré", "Cendrés"),
	TG("21.png", "10.1", "Blond platine cendré", "Cendrés"),
	TG("18.png", "5.12", "Chatain clair cendré perle", "Cendrés"),
	TG("17.png", "7.12", "Blond cendré irisé", "Cendrés"),
	TG("19.png", "9.12", "Blond très clair cendré irisé", "Cendrés"),
	TG("23.png", "1.11", "Noir bleu", "Cendrés"),
	TG("24.png", "5.11", "Chatain clair cendré intense", "Cendrés"),
	TG("25.png", "7.11", "Blond cendré intense", "Cendrés"),
	TG("26.png", "9.11", "Blond très clair cendré intense", "Cendrés"),
	TG("27.png", "4.19", "Chatain ice", "Cendrés"),
	TG("28.png", "5.91", "Chatain clair ice", "Cendrés"),
	TG("29.png", "7.91", "Blond ice", "Cendrés"),

	TG("30.png", "4.9", "Chatain marron", "Marrons"),
	TG("31.png", "5.9", "Chatain clair marron", "Marrons"),
	TG("32.png", "6.9", "Blond foncé marron", "Marrons"),
	TG("33.png", "7.9", "Blond marron", "Marrons"),
	TG("34.png", "8.9", "Blond clair savane", "Marrons"),
	TG("36.png", "10.9", "Blond marron ultra savane", "Marrons"),

	TG("44.png", "5.21", "Chatain clair perle cendré", "Perle"),
	TG("45.png", "8.02", "Blond clair perle", "Perle"),
	TG("43.png", "10.02", "Blond platine perlé", "Perle"),
	TG("37.png", "10.21", "Blond platine perle cendré", "Perle"),

	TG("38.png", "6.3", "Blond foncé doré", "Dorés"),
	TG("39.png", "7.3", "Blond doré", "Dorés"),
	TG("42.png", "8.13", "Blond clair cendré doré", "Dorés"),
	TG("41.png", "9.13", "Blond très clair doré cendré", "Dorés"),
	TG("40.png", "9.32", "Blond très clair doré irisé", "Dorés"),

	TG("47.png", "4.05", "Chocolat", "Chocolat & Moka"),
	TG("48.png", "5.8", "Chatain clair moka", "Chocolat & Moka"),
	TG("49.png", "6.8", "Blond foncé moka", "Chocolat & Moka"),
	TG("52.png", "4.35", "Café", "Chocolat & Moka"),

	TG("50.png", "4.5", "Chatain acajou", "Acajou"),
	TG("51.png", "5.5", "Blond foncé acajou", "Acajou"),

	TG("54.png", "9.17", "Blond très clair cendré violet", "Violet"),

	TG("55.png", "7.4", "Blond cuivre", "Cuivrés"),
	TG("56.png", "8.4", "Blond clair cuivre", "Cuivrés"),

	TG("57.png", "4.6", "Chatain rouge", "Rouges"),
	TG("58.png", "5.6", "Chatain clair rouge", "Rouges"),
	TG("59.png", "6.6", "Blond foncé rouge", "Rouges"),
	TG("60.png", "6.66", "Blond foncé rouge intense", "Rouges"),

	// Le dossier ne contient que 4 boosters sur les 6 du nuancier
	// (Rouge et Cuivre n'ont pas de mèche) : on n'affiche que ceux qui existent.
	TG("62.png", "GOLD", "Or", "Booster"),
	TG("63.png", "BLUE", "Bleu", "Booster"),
	TG("64.png", "GREEN", "Vert", "Booster"),
	TG("61.png", "VIOLET", "Violet", "Booster"),

	TG("66.png", "9.11T", "Gris argent intense", "Toner"),
	TG("67.png", "12.13T", "Blond doré ultra clair cendré", "Toner"),
];

export const TEINTE_PDFS = {
	Anea: "/anea.pdf",
	Togethair: "/TOGETHAIR.pdf",
};

// Renvoie le nuancier correspondant au champ `teints` du produit.
export const getTeintes = (brand) => {
	if (brand === "Anea") return ANEA_TEINTES;
	if (brand === "Togethair") return TOGETHAIR_TEINTES;
	return [];
};

export const getTeintePdf = (brand) => TEINTE_PDFS[brand] || null;

// Regroupe une liste de teintes par famille, en conservant l'ordre du nuancier.
export const groupTeintes = (teintes) => {
	const groups = [];
	(teintes || []).forEach((teinte) => {
		const key = teinte.group || "Teintes";
		let bucket = groups.find((g) => g.name === key);
		if (!bucket) {
			bucket = { name: key, teintes: [] };
			groups.push(bucket);
		}
		bucket.teintes.push(teinte);
	});
	return groups;
};
