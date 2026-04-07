import { Component } from "react";

export default class GlobeErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.error("3D Globe error:", err);
    if (this.props.onError) this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="globe3d-fallback">
          <div className="globe3d-fallback-icon">🗺️</div>
          <p className="globe3d-fallback-msg">
            تعذّر تشغيل الخريطة ثلاثية الأبعاد
          </p>
          <p className="globe3d-fallback-sub">
            جارٍ التحويل للخريطة المسطحة...
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
