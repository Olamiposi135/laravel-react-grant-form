import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ImageWithSkeleton = ({ src, alt, className = "", style = {}, height = 160 }) => {
	// ...local state and effects...
	const [loaded, setLoaded] = React.useState(false);
	React.useEffect(() => setLoaded(false), [src]);

	// if no src show box skeleton
	if (!src) {
		return <Skeleton height={height} borderRadius={8} className={className} />;
	}

	return (
		<div className={className} style={{ position: "relative", ...style }}>
			{!loaded && <Skeleton height={height} borderRadius={8} />}
			<img
				src={src}
				alt={alt}
				loading="lazy"
				onLoad={() => setLoaded(true)}
				style={{
					display: loaded ? "block" : "none",
					width: "100%",
					height: "auto",
					borderRadius: 8,
				}}
			/>
		</div>
	);
};

export default ImageWithSkeleton;
