function Castells(props) {
	const { diades, puntuacions } = props;

	const getCastell = castell => {
		if (castell.includes("C"))
			return [castell.slice(0, -1), false];
		return [castell, true];
	};

	const not_scored_castells = {};
	const castells_dict = {};
	[...Object.values(diades)].forEach(diada => {
		diada["castells"].forEach(dict => {
			const castell = Object.values(dict)[0];
			const [cas, des] = getCastell(castell);

			if (!(cas.replace('T','2') in puntuacions)) {
				if (!(cas in not_scored_castells))
					not_scored_castells[cas] = 0;
				not_scored_castells[cas] += 1;
				//return;
			}

			if (!(cas in castells_dict))
				castells_dict[cas] = [0, 0];

			if (des)	castells_dict[cas][0] += 1;
			else		castells_dict[cas][1] += 1;
		})
	});
	console.log(not_scored_castells)

	const castells = Object.keys(castells_dict).map(function(key) {
		return [key, castells_dict[key]];
	});
	castells.sort(function(a, b) {
		let scoreA = puntuacions[a[0].replace('T','2')];
		let scoreB = puntuacions[b[0].replace('T','2')];

		if (scoreA === undefined) {
			const structure = parseInt(a[0].split('d')[0].replace('T','2').replace('P','1'));
			const floors = parseInt(a[0].split('d')[1]);
			scoreA = 10 * structure + floors;
		}
		if (scoreB === undefined) {
			const structure = parseInt(b[0].split('d')[0].replace('T','2').replace('P','1'));
			const floors = parseInt(b[0].split('d')[1]);
			scoreB = 10 * structure + floors;
		}

		return scoreB - scoreA;
	});

	return (
		<div id="castells">
			<h1>Resum històric</h1>
			<div className="wrap">
			{
				castells.map(castell => {
					let html;
					if (castell[1][0] === 0)
						html = <h3><span>{castell[1][1]}c</span></h3>;
					else if (castell[1][1] === 0)
						html = <h3>{castell[1][0]}</h3>;
					else
						html = <h3>{castell[1][0]}<span> + {castell[1][1]}c</span></h3>;
					
					if (!(castell[0].replace('T','2') in puntuacions))
						return;
					
					return (
						<div className="castell">
							<h2>{castell[0]}</h2>
							{html}
						</div>
					);
				})
			}
			</div>
			<hr/>
			<div className="wrap">
			{
				castells.map(castell => {
					if (castell[0].replace('T','2') in puntuacions)
						return;
					
					let html;
					if (castell[1][0] === 0)
						html = <h3><span>{castell[1][1]}c</span></h3>;
					else if (castell[1][1] === 0)
						html = <h3>{castell[1][0]}</h3>;
					else
						html = <h3>{castell[1][0]}<span> + {castell[1][1]}c</span></h3>;
					
					return (
						<div className="castell">
							<h2>{castell[0]}</h2>
							{html}
						</div>
					);
				})
			}
			</div>
		</div>
	);
}

export default Castells;
