export class FooterView {
  markup = () => {
    return `
    <div class="footer">footer</div>
    `
  }

  render = () => {
    document.querySelector('#root')?.insertAdjacentHTML('beforeend', this.markup())
  } 
}