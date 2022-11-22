import { FC } from 'react';
import { PageTitle } from '../Components/PageTitle';

//Interface Props with optional title
interface Props {
    title?: string;
}

//Children: a magical prop that all REACT components have. Used to render child nodes.
//Children allows rendering of custom content within the component. Children prop is a function prop.
export const Page: FC<Props> = ({ title, children }) => (
    <div className="pageTitleApp">
        {title && <PageTitle>{title}</PageTitle>}
        {children}
    </div>
);