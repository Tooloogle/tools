import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sqlFormatterStyles from './sql-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('sql-formatter')
export class SqlFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, sqlFormatterStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private formatSql() {
        let sql = this.input;
        
        // Keywords to uppercase and format
        const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 
                         'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 
                         'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 
                         'ALTER TABLE', 'DROP TABLE', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'UNION'];
        
        // Uppercase keywords
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            sql = sql.replace(regex, keyword);
        });
        
        // Add newlines before major keywords
        sql = sql.replace(/(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)/gi, '\n$1');
        
        // Clean up multiple newlines
        sql = sql.replace(/\n+/g, '\n');
        
        // Trim and remove leading newline
        sql = sql.trim();
        
        this.output = sql;
    }

    private minify() {
        let sql = this.input;
        
        // Remove extra whitespace
        sql = sql.replace(/\s+/g, ' ');
        
        this.output = sql.trim();
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">SQL Input:</span>
                <textarea
                    class="form-textarea font-mono text-sm"
                    placeholder="Paste SQL query here..."
                    rows="10"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.formatSql}>Format SQL</button>
                <button class="btn btn-blue" @click=${this.minify}>Minify SQL</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Formatted Output:</span>
                    <textarea
                        class="form-textarea font-mono text-sm"
                        rows="10"
                        readonly
                        .value=${this.output}
                    ></textarea>
                    <div class="py-2 text-right">
                        <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                    </div>
                </label>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sql-formatter': SqlFormatter;
    }
}
