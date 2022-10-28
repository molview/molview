#!/usr/bin/env bash

# Selects all minerals from the COD database and writes them to src/datasets/MineralNames.json
# Formatted using SED as:
# var MineralNames = {
# 	"records": [
# 		{ "name": "Agaite", "codid": "9016323" },
# 		{ "name": "Ajoite", "codid": "9009649" }
# 	]
# }

mysql -N -u cod_reader -h www.crystallography.net -e 'SELECT mineral,file FROM data WHERE (mineral RLIKE "^[A-Z]" AND mineral NOT RLIKE "\t" AND mineral NOT LIKE "%?%" AND mineral <> "" AND mineral IS NOT NULL AND flags LIKE "%has coordinates%") GROUP BY mineral' cod | sed  -e 's/\t/", "codid": "/g' -e 's/^/\t\t{ "name": "/g' -e 's/$/" },/g' -e '1 s/^/var MineralNames = {\n\t"records": [\n/' -e '$s/,$/\n\t]\n}/' > MineralNames.js
