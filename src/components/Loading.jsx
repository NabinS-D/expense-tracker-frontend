// components/Loading.js
import React from "react";
import { Box, Skeleton } from "@mui/material";

const Loading = ({ height = 300, width = "100%" }) => {
    return (
        <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width={width} height={height} sx={{ my: 2 }} />
            <Skeleton variant="text" width={100} height={30} />
        </Box>
    );
};

export default Loading;
