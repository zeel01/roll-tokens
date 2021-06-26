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

	static renderTokenConfig(app, html, data) {
		const el = html.find(".tab[data-tab=image] .form-group").first();

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