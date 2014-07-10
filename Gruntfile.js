module.exports = function(grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify:
		{
			options:
			{
				banner: '/*!\n\
MolView <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n\
Copyright (c) 2014, Herman Bergwerf\n\
ALL RIGHTS RESERVED\n\
Included files (can be found under http://molview.org/{path})\n\
src/js/lib/JSmol.min.js\n\
src/js/lib/jquery-1.11.0.min.js\n\
src/js/lib/jquery.hotkeys.js\n\
src/js/lib/Detector.js\n\
src/js/lib/jMouseWheel.js\n\
src/js/lib/Polyfill.js\n\
src/js/m2s/prototype.js\n\
src/js/m2s/util/common.js\n\
src/js/m2s/util/vec2.js\n\
src/js/m2s/util/set.js\n\
src/js/m2s/util/map.js\n\
src/js/m2s/util/pool.js\n\
src/js/m2s/chem/element.js\n\
src/js/m2s/chem/struct.js\n\
src/js/m2s/chem/molfile.js\n\
src/js/m2s/chem/sgroup.js\n\
src/js/m2s/chem/struct_valence.js\n\
src/js/m2s/chem/dfs.js\n\
src/js/m2s/chem/cis_trans.js\n\
src/js/m2s/chem/stereocenters.js\n\
src/js/m2s/chem/smiles.js\n\
src/js/m2s/chem/inchi.js\n\
src/js/moledit/Constants.js\n\
src/js/moledit/Objects.js\n\
src/js/moledit/Chemical.js\n\
src/js/moledit/ChemicalView.js\n\
src/js/moledit/ChemicalView_core.js\n\
src/js/moledit/ChemicalView_events.js\n\
src/js/moledit/Utility.js\n\
src/js/lib/Three49custom.js\n\
src/js/lib/GLmol.js\n\
src/js/lib/ChemDoodleWeb.js\n\
src/js/lib/Blob.js\n\
src/js/lib/FileSaver.js\n\
src/js/lib/PeriodicTable.js\n\
src/js/Utility.js\n\
src/js/Variables.js\n\
src/js/History.js\n\
src/js/Progress.js\n\
src/js/Messages.js\n\
src/js/Sketcher.js\n\
src/js/Model.js\n\
src/js/Request.js\n\
src/js/Loader.js\n\
src/js/Actions.js\n\
src/js/Share.js\n\
src/js/Link.js\n\
src/js/ChemicalData.js\n\
src/js/Autocomplete.js\n\
src/js/MolView.js\n\
*/\n',
				compress: { drop_console: true }
			},
			build:
			{
				src: [
					'src/js/lib/JSmol.min.js',
					
					//Misc
					'src/js/lib/jquery-1.11.0.min.js',
					'src/js/lib/jquery.hotkeys.js',
					'src/js/lib/Detector.js',
					'src/js/lib/jMouseWheel.js',
					'src/js/lib/Polyfill.js',
					
					//Ketcher
					'src/js/m2s/prototype.js',
					'src/js/m2s/util/common.js',
					'src/js/m2s/util/vec2.js',
					'src/js/m2s/util/set.js',
					'src/js/m2s/util/map.js',
					'src/js/m2s/util/pool.js',
					'src/js/m2s/chem/element.js',
					'src/js/m2s/chem/struct.js',
					'src/js/m2s/chem/molfile.js',
					'src/js/m2s/chem/sgroup.js',
					'src/js/m2s/chem/struct_valence.js',
					'src/js/m2s/chem/dfs.js',
					'src/js/m2s/chem/cis_trans.js',
					'src/js/m2s/chem/stereocenters.js',
					'src/js/m2s/chem/smiles.js',
					'src/js/m2s/chem/inchi.js',
					
					//MolEdit
					'src/js/moledit/Constants.js',
					'src/js/moledit/Objects.js',
					'src/js/moledit/Chemical.js',
					'src/js/moledit/ChemicalView.js',
					'src/js/moledit/ChemicalView_core.js',
					'src/js/moledit/ChemicalView_events.js',
					'src/js/moledit/Utility.js',
					
					//GLmol
					'src/js/lib/Three49custom.js',
					'src/js/lib/GLmol.js',
					
					//ChemDoodle
					'src/js/lib/ChemDoodleWeb.js',
					
					//FileSaver
					'src/js/lib/Blob.js',
					'src/js/lib/FileSaver.js',
					
					//Periodic Table
					'src/js/lib/PeriodicTable.js',
					
					//MolView source
					'src/js/Utility.js',
					'src/js/Variables.js',
					'src/js/History.js',
					'src/js/Progress.js',
					'src/js/Messages.js',
					'src/js/Sketcher.js',
					'src/js/Model.js',
					'src/js/Request.js',
					'src/js/Loader.js',
					'src/js/Actions.js',
					'src/js/Share.js',
					'src/js/Link.js',
					'src/js/ChemicalData.js',
					'src/js/Autocomplete.js',
					'src/js/MolView.js'
				],
				dest: 'build/<%= pkg.name %>.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify']);
};
