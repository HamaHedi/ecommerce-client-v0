import React, { useMemo, useState } from "react";
import { Image } from "antd";
import "../styles/teintes.css";

// Liste de teintes : mèche + « nom - référence » + sélecteur de quantité.
// Utilisée en aperçu sur la fiche produit et en pleine largeur dans la modale.
const TeinteList = ({
	teintes = [],
	quantities = {},
	onChange,
	searchable = true,
	columns = 1,
	maxHeight = 420,
	emptyLabel = "Aucune teinte ne correspond à cette recherche.",
}) => {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return teintes;
		return teintes.filter(
			(teinte) =>
				teinte.name?.toLowerCase().includes(q) ||
				teinte.reference?.toLowerCase().includes(q) ||
				teinte.group?.toLowerCase().includes(q)
		);
	}, [teintes, query]);

	const setQty = (teinte, qty) => {
		if (!onChange) return;
		onChange(teinte, Math.max(0, qty));
	};

	return (
		<div className="teinte-list">
			{searchable && (
				<div className="teinte-search">
					<i className="fa fa-search" aria-hidden="true"></i>
					<input
						type="search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Rechercher une teinte, une référence…"
						aria-label="Rechercher une teinte"
					/>
					{query && (
						<button
							type="button"
							className="teinte-search-clear"
							onClick={() => setQuery("")}
							aria-label="Effacer la recherche"
						>
							<i className="fa fa-times" aria-hidden="true"></i>
						</button>
					)}
				</div>
			)}

			<div
				className={`teinte-rows ${columns > 1 ? "teinte-rows-grid" : ""}`}
				style={{
					maxHeight: maxHeight ? `${maxHeight}px` : undefined,
					"--teinte-columns": columns,
				}}
			>
				{filtered.length === 0 ? (
					<p className="teinte-empty">{emptyLabel}</p>
				) : (
					// Cliquer une mèche ouvre la visionneuse zoomable d'antd ;
					// le groupe permet de passer d'une teinte à l'autre sans fermer.
					<Image.PreviewGroup>
					{filtered.map((teinte) => {
						const qty = Number(quantities[teinte.reference] || 0);
						return (
							<div
								className={`teinte-row ${qty > 0 ? "is-selected" : ""}`}
								key={`${teinte.reference}-${teinte.img}`}
							>
								<Image
									src={teinte.img}
									alt={`${teinte.name} ${teinte.reference}`}
									rootClassName="teinte-swatch-wrap"
									className="teinte-swatch"
									loading="lazy"
									preview={{
										mask: (
											<span className="teinte-zoom-mask">
												<i className="fa fa-search-plus" aria-hidden="true"></i>
											</span>
										),
									}}
								/>

								<span className="teinte-label">
									<span className="teinte-name">{teinte.name}</span>
									<span className="teinte-ref"> - {teinte.reference}</span>
								</span>

								<div className="teinte-stepper">
									<button
										type="button"
										onClick={() => setQty(teinte, qty - 1)}
										disabled={qty <= 0}
										aria-label={`Retirer une unité de ${teinte.reference}`}
									>
										−
									</button>
									<span className="teinte-qty">{qty}</span>
									<button
										type="button"
										onClick={() => setQty(teinte, qty + 1)}
										aria-label={`Ajouter une unité de ${teinte.reference}`}
									>
										+
									</button>
								</div>
							</div>
						);
					})}
					</Image.PreviewGroup>
				)}
			</div>
		</div>
	);
};

export default TeinteList;
