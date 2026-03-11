export class DragManager {
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private startLeft = 0;
  private startTop = 0;

  constructor(private handle: HTMLElement, private container: HTMLElement) {
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    handle.addEventListener("mousedown", this.handleMouseDown);
  }

  private handleMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    const rect = this.container.getBoundingClientRect();
    this.startLeft = rect.left;
    this.startTop = rect.top;
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    e.preventDefault();
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.container.style.left = `${this.startLeft + dx}px`;
    this.container.style.top = `${this.startTop + dy}px`;
  }

  private handleMouseUp() {
    this.isDragging = false;
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    // Save position to session storage
    const rect = this.container.getBoundingClientRect();
    chrome.runtime.sendMessage({ type: "SAVE_OVERLAY_POSITION", payload: { x: rect.left, y: rect.top } });
  }

  destroy() {
    this.handle.removeEventListener("mousedown", this.handleMouseDown);
  }
}
