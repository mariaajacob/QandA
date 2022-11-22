import styled from "@emotion/styled";

export const PrimaryButton = styled.button`
  background: #879637;
  border-color: #68742a;
  outline-color: #68742a;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  border-style: solid;
  :hover {
    background: #206c49;
    border-color: #164b33;
    outline-color: #164b33;
    color: #fff;
  }
  :focus {
    background: #206c49;
    border-color: #164b33;
    outline-color: #164b33;
    color: #fff;
  }
  :disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;