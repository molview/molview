module.exports = function(grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify:
		{
			index:
			{
				options:
				{
					banner: '/*!\n\
MolView <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n\
Copyright (c) 2014, Herman Bergwerf\n\
ALL RIGHTS RESERVED
*/\n',
					compress: { drop_console: true }
				},
				src: [
					'src/js/lib/JSmol.min.js',

					//Misc
					'src/js/lib/jquery-1.11.1.min.js',
					'src/js/lib/jquery.hotkeys.js',
					'src/js/lib/Detector.js',
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
					'src/js/lib/three.min.js',
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
					'src/js/Data.js',
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
					'src/js/InfoCard.js',
					'src/js/Spectroscopy.js',
					'src/js/Autocomplete.js',
					'src/js/MolView.js'
				],
				dest: 'build/<%= pkg.name %>.min.js'
			},
			embed:
			{
				options:
				{
					banner: '/*!\n\
MolView <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n\
Copyright (c) 2014, Herman Bergwerf\n\
ALL RIGHTS RESERVED
*/\n',
					compress: { drop_console: true }
				},
				src: [
					'src/js/lib/JSmol.min.js',
					'src/js/lib/jquery-1.11.1.min.js',
					'src/js/lib/Detector.js',
					'src/js/lib/Polyfill.js',
					'src/js/lib/three.min.js',
					'src/js/lib/GLmol.js',
					'src/js/lib/ChemDoodleWeb.js',
					'src/js/Utility.js',
					'src/js/Progress.js',
					'src/js/Messages.js',
					'src/js/Model.js',
					'src/js/Request.js',
					'src/js/Loader.Embed.js',
					'src/js/MolView.Embed.js'
				],
				dest: 'build/<%= pkg.name %>.embed.min.js'
			}
		},
		less:
		{
			index:
			{
				options:
				{
					compress: true,
					cleancss: true
				},
				src: [
					'src/less/vars.less',
					'src/less/form.less',
					'src/less/global.less',
					'src/less/layout.less',
					'src/less/menu.less',
					'src/less/menu-theme.less',
					'src/less/sketcher.less',
					'src/less/model.less',
					'src/less/search.less',
					'src/less/messages.less',
					'src/less/progress.less',
					'src/less/swipeable.less',
					'src/less/dialogs.less',
					'src/less/help.less',
					'src/less/share.less',
					'src/less/periodictable.less',
					'src/less/chemicaldata.less',
					'src/less/autocomplete.less',
					'src/less/welcome.less'
				],
				dest: 'build/<%= pkg.name %>.min.css'
			},
			embed:
			{
				options:
				{
					compress: true,
					cleancss: true
				},
				src: [
					'src/less/var.less',
					'src/less/form.less',
					'src/less/global.less',
					'src/less/model.less',
					'src/less/messages.less',
					'src/less/embed.less'
				],
				dest: 'build\/<%= pkg.name %>.embed.min.css'
			},
			desktop:
			{
				options:
				{
					compress: true,
					cleancss: true
				},
				src: [
					'src/less/var.less',
					'src/less/menu-desktop.less',
					'src/less/smooth.less',
					'src/less/hover.less',
					'src/less/active.less'
				],
				dest: 'build\/<%= pkg.name %>.desktop.min.css'
			},
			touch:
			{
				options:
				{
					compress: true,
					cleancss: true
				},
				src: [
					'src/less/var.less',
					'src/less/menu-touch.less',
					'src/less/active.less'
				],
				dest: 'build\/<%= pkg.name %>.touch.min.css'
			},
			mobile:
			{
				options:
				{
					compress: true,
					cleancss: true
				},
				src: [
					'src/less/mobile.less'
				],
				dest: 'build\/<%= pkg.name %>.mobile.min.css'
			}
		},
		svgmin:
		{
			options:
			{
				plugins: [
				]
			},
			dist:
			{
				files: [
					{
						expand: true,
						cwd: 'src/img',
						src: ['**/*.svg'],
						dest: 'img/',
						ext: '.svg'
					}]
			}
		},
		watch:
		{
			scripts: {
				files: ['src/less/*.less'],
				tasks: ['less'],
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['uglify', 'less', 'svgmin']);
};
