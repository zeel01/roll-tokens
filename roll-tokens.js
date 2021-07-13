class RollTokens {
	static renderTokenHUD(hud, html, data) {
		const tableName = data.flags?.["roll-tokens"]?.table;
		if (!tableName) return;

		const col = html.find(".col.right");

		const button = col.append(`
			<div class="control-icon">
				<i class="fas fa-sync"></i>
			</div>
		`);
		
		button.click(this.rollToken.bind(this, hud, tableName));
	}

	/**
	 * Handles the renderTokenConfig hook.
	 *
	 * Inserts an additional tab into the token config.
	 *
	 * @static
	 * @param {Application} app  - The Application of the token config
	 * @param {jQuery}      html - A jQuery object representing the application's HTML/DOM
	 * @param {object}      data - The data used to render the application
	 * @memberof RollTokens
	 */
	static async renderTokenConfig(app, html, data) {
		console.log(app);

		const imageItem = html.find(".item[data-tab=image]");
		const imageTab  = html.find(".tab[data-tab=image]");
		const flags     = data.object.flags?.["roll-tokens"];
		console.debug(flags)
		const tableId   = flags?.table;
		
		data.tables = game.tables;
		data.rollTokens = flags;

		if (tableId) {
			const tableData = game.tables.get(tableId);
			if (tableData) {
				data.table = true;
				data.tableData = tableData;
			}
		}

		const item = imageItem.after(this.getTabControlHtml());
		const tab  = imageTab.after(await this.getRollTokenTabHtml(data));

		app.options.closeOnSubmit = false;

		this.activateListeners(html, data);
	}

		el.after(`
			<div class="form-group">
				<label>Token Image Rollable Table</label>
				<input type="text" name="flags.roll-tokens.table" placeholder="Rollable Table" value="${data.object.flags["roll-tokens"].table || ""}">
			</div>`
		);
	}

	static async rollToken(hud, tableName) {
		console.log(tableName);
		const table = game.tables.getName(tableName);
		if (!table) return ui.notifications.warn(
			game.i18n.format("rolltkn.notifications.warn.invalidTable", { tableName })
		);

		console.debug(table);

		const roll = await table.roll();
		const result = roll.results[0];
		const img = result.data.img;

		hud.object.document.update({ img });
	}
}

Hooks.on("renderTokenHUD", RollTokens.renderTokenHUD.bind(RollTokens));
Hooks.on("renderTokenConfig", RollTokens.renderTokenConfig.bind(RollTokens));