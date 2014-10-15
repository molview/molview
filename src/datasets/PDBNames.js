var PDBNames = {
	"types": [
		"Digestive Enzymes",
		"Blood Plasma Proteins",
		"Viruses and Antibodies",
		"Hormones",
		"Channels, Pumps and Receptors",
		"Photosynthesis",
		"Energy Production",
		"Storage",
		"Enzymes",
		"Infrastructure",
		"Protein Synthesis",
		"Genetic Information"
	],

	"macromolecules": [
		//Digestive Enzymes: breaking food into small nutrient molecules
		{ "type": 0, "name": "Amylase",				"pdbids": ["1smd"]},
		{ "type": 0, "name": "Phospholipase",		"pdbids": ["1poe"]},
		{ "type": 0, "name": "Deoxyribonuclease",	"pdbids": ["2dnj"]},
		{ "type": 0, "name": "Lysozyme",			"pdbids": ["1lz1"]},
		{ "type": 0, "name": "Pepsin",				"pdbids": ["5pep"]},
		{ "type": 0, "name": "Trypsin",				"pdbids": ["2ptc"]},
		{ "type": 0, "name": "Carboxypeptidase",	"pdbids": ["3cpa"]},
		{ "type": 0, "name": "Ribonuclease",		"pdbids": ["5rsa"]},

		//Blood Plasma Proteins: transporting nutrients and defending against injury
		{ "type": 1, "name": "Factor X",		"pdbids": ["1xka","1iod"]},
		{ "type": 1, "name": "Thrombin",		"pdbids": ["1ppb"]},
		{ "type": 1, "name": "Fibrin",			"pdbids": ["1m1j","2baf"]},
		{ "type": 1, "name": "Serum Albumin",	"pdbids": ["1e7i"]},

		//Viruses and Antibodies: engaging in constant battle in the bloodstream
		{ "type": 2, "name": "Antibody",	"pdbids": ["1igt"]},
		{ "type": 2, "name": "Rhinovirus",	"pdbids": ["4rhv"]},

		//Hormones: carrying molecular messages through blood
		{ "type": 3, "name": "Glucagon",				"pdbids": ["1gcn"]},
		{ "type": 3, "name": "Insulin",					"pdbids": ["2hiu"]},
		{ "type": 3, "name": "Epidermal Growth Factor",	"pdbids": ["1egf"]},

		//Channels, Pumps and Receptors: getting back and forth across the membrane
		{ "type": 4, "name": "Ras Protein",								"pdbids": ["5p21"]},
		{ "type": 4, "name": "Beta2-Adrenergic Receptor/Gs Protein",	"pdbids": ["3sn6"]},
		{ "type": 4, "name": "Acetylcholine Receptor",					"pdbids": ["2bg9"]},
		{ "type": 4, "name": "Epidermal Growth Factor Receptor",		"pdbids": ["1ivo","2jwa","2gs6"]},
		{ "type": 4, "name": "Rhodopsin",								"pdbids": ["1f88"]},
		{ "type": 4, "name": "P-glycoprotein",							"pdbids": ["3g61"]},
		{ "type": 4, "name": "Potassium Channel",						"pdbids": ["3lut"]},
		{ "type": 4, "name": "Calcium Pump",							"pdbids": ["1su4"]},
		{ "type": 4, "name": "Cyclooxygenase",							"pdbids": ["1prh"]},

		//Photosynthesis: harvesting energy from the sun
		{ "type": 5, "name": "Photosystem II",					"pdbids": ["1s5l"]},
		{ "type": 5, "name": "Light-harvesting Complex",		"pdbids": ["1rwt"]},
		{ "type": 5, "name": "Photosynthetic Reaction Center",	"pdbids": ["1prc"]},

		//Energy Production: powering the processes of the cell
		{ "type": 6, "name": "Cytochrome c Oxidase (Complex IV)",			"pdbids": ["1oco"]},
		{ "type": 6, "name": "Cytochrome c",								"pdbids": ["3cyt"]},
		{ "type": 6, "name": "Cytochrome bc1 (Complex III)",				"pdbids": ["1bgy"]},
		{ "type": 6, "name": "Succinate Dehydrogenase (Complex II)",		"pdbids": ["1nek"]},
		{ "type": 6, "name": "NADH-Quinone Oxidoreductase (Complex I)",		"pdbids": ["3m9s","3rko"]},
		{ "type": 6, "name": "ATP Synthase",								"pdbids": ["1e79","1c17","1l2p","2a7u"]},
		{ "type": 6, "name": "Myoglobin",									"pdbids": ["1mbd"]},
		{ "type": 6, "name": "Hemoglobin",									"pdbids": ["4hhb"]},

		//Storage: containing nutrients for future consumption
		{ "type": 7, "name": "Ferritin",	"pdbids": ["1hrs"]},

		//Enzymes: cutting and joining the molecules of life
		{ "type": 8, "name": "Fatty Acid Synthase 2uvb,",								"pdbids": ["2uvb","2uvc"]},
		{ "type": 8, "name": "RuBisCo: Ribulose Bisphosphate Carboxylase/Oxygenase",	"pdbids": ["1rcx"]},
		{ "type": 8, "name": "Green Fluorescent Protein",								"pdbids": ["1gfl"]},
		{ "type": 8, "name": "Luciferase",												"pdbids": ["2d1s"]},
		{ "type": 8, "name": "Glutamine Synthetase",									"pdbids": ["2gls"]},
		{ "type": 8, "name": "Alcohol Dehydrogenase",									"pdbids": ["2ohx"]},
		{ "type": 8, "name": "Dihydrofolate Reductase",									"pdbids": ["1dhf"]},
		{ "type": 8, "name": "Nitrogenase",												"pdbids": ["1n2c"]},
		{ "type": 8, "name": "Leucine Aminopeptidase",									"pdbids": ["1lap"]},
		{ "type": 8, "name": "beta-Lactamase",											"pdbids": ["4blm"]},
		{ "type": 8, "name": "Catalase",												"pdbids": ["1qqw"]},
		{ "type": 8, "name": "Thymidylate Synthase",									"pdbids": ["2tsc"]},
		{ "type": 8, "name": "Tryptophan Synthase",										"pdbids": ["1wsy"]},
		{ "type": 8, "name": "Aspartate Carbamoyltransferase",							"pdbids": ["4at1"]},
		{ "type": 8, "name": "Hexokinase",												"pdbids": ["1dgk"]},
		{ "type": 8, "name": "Phosphoglucose Isomerase",								"pdbids": ["1hox"]},
		{ "type": 8, "name": "Phosphofructokinase",										"pdbids": ["4pfk"]},
		{ "type": 8, "name": "Aldolase",												"pdbids": ["4ald"]},
		{ "type": 8, "name": "Triosephosphate Isomerase",								"pdbids": ["2ypi"]},
		{ "type": 8, "name": "Glyceraldehyde-3-phosphate Dehydrogenase",				"pdbids": ["3gpd"]},
		{ "type": 8, "name": "Phosphoglycerate Kinase",									"pdbids": ["3pgk"]},
		{ "type": 8, "name": "Phospoglycerate Mutase",									"pdbids": ["3pgm"]},
		{ "type": 8, "name": "Enolase",													"pdbids": ["5enl"]},
		{ "type": 8, "name": "Pyruvate Kinase",											"pdbids": ["1a3w"]},

		//Infrastructure: supporting and moving cells
		{ "type": 9, "name": "Actin",		"pdbids": ["1m8q"]},
		{ "type": 9, "name": "Myosin",		"pdbids": ["1m8q"]},
		{ "type": 9, "name": "Microtubule",	"pdbids": ["1tub"]},
		{ "type": 9, "name": "Collagen",	"pdbids": ["1bkv"]},

		//Protein Synthesis: building new molecular machines
		{ "type": 10, "name": "Transfer RNA",					"pdbids": ["4tna"]},
		{ "type": 10, "name": "Valyl-tRNA Synthetase",			"pdbids": ["1gax"]},
		{ "type": 10, "name": "Threonyl-tRNA Synthetase",		"pdbids": ["1qf10"]},
		{ "type": 10, "name": "Glutaminyl-tRNA Synthetase",		"pdbids": ["1euq"]},
		{ "type": 10, "name": "Isoleucyl-tRNA Synthetase",		"pdbids": ["1ffy"]},
		{ "type": 10, "name": "Phenylalanyl-tRNA Synthetase",	"pdbids": ["1eiy"]},
		{ "type": 10, "name": "Aspartyl-tRNA Synthetase",		"pdbids": ["1asy"]},
		{ "type": 10, "name": "Ribosome",						"pdbids": ["1j5e","1jj2"]},
		{ "type": 10, "name": "Elongation Factor Tu/tRNA",		"pdbids": ["1ttt"]},
		{ "type": 10, "name": "Elongation Factor G",			"pdbids": ["1dar"]},
		{ "type": 10, "name": "Elongation Factor Ts and Tu",	"pdbids": ["1efu"]},
		{ "type": 10, "name": "Prefoldin",						"pdbids": ["1fxk"]},
		{ "type": 10, "name": "Chaperonin GroEL/ES",			"pdbids": ["1aon"]},
		{ "type": 10, "name": "Proline cis/trans Isomerase",	"pdbids": ["2cpl"]},
		{ "type": 10, "name": "Heat Shock Protein Hsp90",		"pdbids": ["2cg9"]},
		{ "type": 10, "name": "Proteasome",						"pdbids": ["4b4t"]},
		{ "type": 10, "name": "Ubiquitin",						"pdbids": ["1ubq"]},

		//DNA: storing and reading genetic information
		{ "type": 11, "name": "DNA",											"pdbids": ["1bna"]},
		{ "type": 11, "name": "Restriction Endonuclease EcoRI",					"pdbids": ["1eri"]},
		{ "type": 11, "name": "DNA Photolyase",									"pdbids": ["1tez"]},
		{ "type": 11, "name": "Topoisomerase",									"pdbids": ["1a36"]},
		{ "type": 11, "name": "RNA Polymerase",									"pdbids": ["2e2i"]},
		{ "type": 11, "name": "lac Repressor 1lbh",								"pdbids": ["1efa"]},
		{ "type": 11, "name": "Cataabolite Gene Activator Protein",				"pdbids": ["1cgp"]},
		{ "type": 11, "name": "TATA-binding Protein/Transcription Factor IIB",	"pdbids": ["1ais"]},
		{ "type": 11, "name": "DNA Helicase",									"pdbids": ["4esv"]},
		{ "type": 11, "name": "DNA Polymerase",									"pdbids": ["1tau"]},
		{ "type": 11, "name": "Nucleosome",										"pdbids": ["1aoi"]},
		{ "type": 11, "name": "HU Protein",										"pdbids": ["1p51"]},
		{ "type": 11, "name": "Single-stranded DNA-binding Protein",			"pdbids": ["3a5u"]}
	]
}
