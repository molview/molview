var JSUnits = {
	base:
	{
		src: [
			'src/js/lib/Polyfill.js',
			'bower_components/jquery/dist/jquery.min.js',
			'src/js/lib/JSmol.min.js',
			'src/js/lib/Detector.js',
			'src/js/lib/three.min.js',
			'src/js/lib/GLmol.js',
			'src/js/lib/ChemDoodleWeb.js'
		]
	},
	applib:
	{
		src: [
			'bower_components/jquery.hotkeys/jquery.hotkeys.js',
			'bower_components/blob/Blob.js',
			'bower_components/file-saver/FileSaver.min.js',
			'src/js/chem/prototype.js',
			'src/js/chem/util/common.js',
			'src/js/chem/util/vec2.js',
			'src/js/chem/util/set.js',
			'src/js/chem/util/map.js',
			'src/js/chem/util/pool.js',
			'src/js/chem/chem/element.js',
			'src/js/chem/chem/struct.js',
			'src/js/chem/chem/molfile.js',
			'src/js/chem/chem/sgroup.js',
			'src/js/chem/chem/struct_valence.js',
			'src/js/chem/chem/dfs.js',
			'src/js/chem/chem/cis_trans.js',
			'src/js/chem/chem/stereocenters.js',
			'src/js/chem/chem/smiles.js'
		]
	},
	datasets:
	{
		src: [
			'src/js/lib/PeriodicTable.js',
			'src/datasets/PDBNames.js',
			'src/datasets/MineralNames.js'
		]
	},
	core:
	{
		src: [
			'src/js/Data.js',
			'src/js/Utility.js',
			'src/js/Preferences.js',
			'src/js/Progress.js',
			'src/js/Messages.js',
			'src/js/GLmolPlugin.js',
			'src/js/JSmolPlugin.js',
			'src/js/CDWPlugin.js',
			'src/js/Model.js',
			'src/js/Request.js'
		]
	},
	molpad:
	{
		src: [
			'src/js/molpad/Data.js',
			'src/js/molpad/Utility.js',
			'src/js/molpad/MPPoint.js',
			'src/js/molpad/MPLine.js',
			'src/js/molpad/MPFragments.js',
			'src/js/molpad/MPAtom.js',
			'src/js/molpad/MPAtom_calc.js',
			'src/js/molpad/MPAtom_handler.js',
			'src/js/molpad/MPBond.js',
			'src/js/molpad/MPBond_calc.js',
			'src/js/molpad/MPBond_handler.js',
			'src/js/molpad/MPSettings.js',
			'src/js/molpad/MolPad.js',
			'src/js/molpad/MPMolecule.js',
			'src/js/molpad/MPSelection.js',
			'src/js/molpad/MPGraphics.js',
			'src/js/molpad/MPEvents.js'
		]
	},
	app:
	{
		src: [
			'src/js/History.js',
			'src/js/Sketcher.js',
			'src/js/SearchGrid.js',
			'src/js/Loader.js',
			'src/js/Actions.js',
			'src/js/Share.js',
			'src/js/Link.js',
			'src/js/InfoCard.js',
			'src/js/Spectroscopy.js',
			'src/js/Autocomplete.js',
			'src/js/MolView.js'
		]
	},
	embed:
	{
		src: [
			'src/js/Loader.Embed.js',
			'src/js/MolView.Embed.js'
		]
	}
}

module.exports = function(grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['build', 'img'],
		uglify:
		{
			base:
			{
				options:
				{
					banner: '/*! MolView JavaScript Base libraries build on <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					compress: { drop_console: true }
				},
				src: JSUnits.base.src,
				dest: 'build/molview-base.min.js'
			},
			applib:
			{
				options:
				{
					banner: '/*! MolView JavaScript App libraries build on <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					compress: { drop_console: true }
				},
				src: JSUnits.applib.src,
				dest: 'build/molview-applib.min.js'
			},
			datasets:
			{
				options:
				{
					banner: '/*! MolView JavaScript Datasets build on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				src: JSUnits.datasets.src,
				dest: 'build/molview-datasets.min.js'
			},
			core:
			{
				options:
				{
					banner: '/*! MolView JavaScript Core build on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				src: JSUnits.core.src,
				dest: 'build/molview-core.min.js'
			},
			molpad:
			{
				options:
				{
					banner: '/*! MolView JavaScript Sketcher build on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				src: JSUnits.molpad.src,
				dest: 'build/molview-molpad.min.js'
			},
			app:
			{
				options:
				{
					banner: '/*! MolView JavaScript App build on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				src: JSUnits.app.src,
				dest: 'build/molview-app.min.js'
			},
			embed:
			{
				options:
				{
					banner: '/*! MolView JavaScript Embed build on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				src: JSUnits.embed.src,
				dest: 'build/molview-embed.min.js'
			}
		},
		replace:
		{
			strict:
			{
				src: 'build/*.min.js',
				dest: 'build/',
				replacements: [{ from: '"use strict";', to: '' }]
    		}
		},
		less:
		{
			app:
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
					'src/less/dialogs.less',
					'src/less/help.less',
					'src/less/share.less',
					'src/less/periodictable.less',
					'src/less/chemicaldata.less',
					'src/less/autocomplete.less',
					'src/less/welcome.less'
				],
				dest: 'build/molview-app.min.css'
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
					'src/less/model.less',
					'src/less/messages.less',
					'src/less/embed.less'
				],
				dest: 'build/molview-embed.min.css'
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
				dest: 'build/molview-desktop.min.css'
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
				dest: 'build/molview-touch.min.css'
			},
			page:
			{
				options:
				{
					compress: true,
					cleancss: true
				},
				src: [
					'src/less/vars.less',
					'src/less/page.less'
				],
				dest: 'build/molview-page.min.css'
			},
		},
		cssmin:
		{
			app:
			{
				src: 'build/molview-app.min.css',
				dest: 'build/molview-app.min.css'
			},
			embed:
			{
				src: 'build/molview-embed.min.css',
				dest: 'build/molview-embed.min.css'
			},
			desktop:
			{
				src: 'build/molview-desktop.min.css',
				dest: 'build/molview-desktop.min.css'
			},
			touch:
			{
				src: 'build/molview-touch.min.css',
				dest: 'build/molview-touch.min.css'
			},
			mobile:
			{
				src: 'build/molview-mobile.min.css',
				dest: 'build/molview-mobile.min.css'
			},
			page:
			{
				src: 'build/molview-page.min.css',
				dest: 'build/molview-page.min.css'
			},
		},
		svgmin:
		{
			options:
			{
				plugins: [
					{ removeViewBox: false },
					{ removeUselessStrokeAndFill: false }
				]
			},
			dist:
			{
				files: [
					{
						expand: true,
						cwd: 'src/svg',
						src: ['action/*', 'bond/*', 'frag/*', 'layout/*', 'misc/*'],
						dest: 'img/',
						ext: '.svg'
					},
					{ src: 'src/svg/icon/mark.svg', dest: 'img/mark.svg' }
				]
			}
		},
		copy:
		{
			img:
			{
				files: [
					{ expand: true, flatten: true, src: 'docs/img/*', dest: 'img/help/', filter: 'isFile' },
					{ src: 'src/svg/icon/agpl.svg', dest: 'img/agpl.svg' },
					{ src: 'src/svg/icon/48.svg', dest: 'img/logo.svg' },
					{ src: 'src/svg/icon/brand.svg', dest: 'img/brand.svg' }
				]
			}
		},
		watch:
		{
			less: {
				files: ['src/less/*.less'],
				tasks: ['less'],
			},
			base: { files: JSUnits.base.src, tasks: ['uglify:base', 'replace:strict'] },
			applib: { files: JSUnits.applib.src, tasks: ['uglify:applib'] },
			datasets: { files: JSUnits.datasets.src, tasks: ['uglify:datasets'] },
			core: { files: JSUnits.core.src, tasks: ['uglify:core'] },
			molpad: { files: JSUnits.molpad.src, tasks: ['uglify:molpad'] },
			app: { files: JSUnits.app.src, tasks: ['uglify:app'] },
			embed: { files: JSUnits.embed.src, tasks: ['uglify:embed'] },
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('jsminify', ['uglify', 'replace']);
	grunt.registerTask('default', ['clean', 'uglify', 'replace', 'less', 'svgmin', 'copy']);
};
