/**
 * @typedef RtFlags - Roll Tokens flags
 * @property {string} img    - The current image path from the table result
 * @property {string} text   - The current text from the table result
 * @property {string} name   - The name substitution string
 * @property {string} table  - The Rollable Table ID
 * @property {string} choice - The currently chosen table result ID
 */


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
		/** @type {RtFlags} */
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

	static activateListeners(html, data) {
		const name = html.find("input[name='flags.roll-tokens.name']");
		name.change((event) => this.onChangeName(event, html, data));

		html.find(".images .image").click((event) => {
			const imgInput    = html.find("input[name=img]");
			const choiceInput = html.find("input[name='flags.roll-tokens.choice']");
			const image = event.currentTarget;
			const choice = image.dataset.choice;
			const img = image.dataset.image;
			console.log(choice);

			choiceInput.val(choice);
			imgInput.val(img);
			
			html.find(".images .image").removeClass("selected");
			image.classList.add("selected");
			
			this.onChangeName(event, html, data);
		});
	}

	static onChangeName(event, html, data) {
		const nameInput = html.find("input[name=name]");
		const text = html.find(".image.selected")[0].dataset.text;
		const value = html.find("input[name='flags.roll-tokens.name']").val();
		const name = value.replace(/\$\$\$/, text);
		nameInput.val(name);
		console.log(nameInput, name)
	}

	static getTabControlHtml() {
		return `<a class="item" data-tab="roll-token"><i class="fas fa-dice"></i> Roll</a>`
	}
	static async getRollTokenTabHtml(data) {
		return await renderTemplate("modules/roll-tokens/roll-tokens-tab.hbs", data);
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
		const img  = result.data.img;
		const text = result.data.text;

		const template = hud.object.data.flags?.["roll-tokens"]?.name || "";
		const name = template.replace(/\$\$\$/, text)

		hud.object.document.update({ 
			img, name,
			flags: { "roll-tokens": {
				img, text
			}}
		});
	}
}

Hooks.on("renderTokenHUD", RollTokens.renderTokenHUD.bind(RollTokens));
Hooks.on("renderTokenConfig", RollTokens.renderTokenConfig.bind(RollTokens));