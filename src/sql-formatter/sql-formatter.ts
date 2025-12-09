import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sqlFormatterStyles from './sql-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';

@customElement('sql-formatter')
export class SqlFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, sqlFormatterStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
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
                <t-textarea placeholder="Paste SQL query here..." rows="10" class="font-mono text-sm"></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.formatSql}>Format SQL</t-button>
                <t-button variant="blue" @click=${this.minify}>Minify SQL</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Formatted Output:</span>
                    <t-textarea rows="10" ?readonly=${true} class="font-mono text-sm"></t-textarea>
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
